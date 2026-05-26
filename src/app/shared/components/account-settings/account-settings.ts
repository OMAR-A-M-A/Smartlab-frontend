import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  // Identity Data
  currentUser: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  staffInfo: any = {
    department: 'Loading...',
    shift: 'Loading...',
    salary: 'Loading...',
    nationalId: 'Loading...',
  };

  userRole: string = '';
  isLoadingData: boolean = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isLoading: boolean = true;
  isEditProfileModalOpen: boolean = false;
  isEditPasswordModalOpen: boolean = false;
  isSavingProfile: boolean = false;
  isSavingPassword: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.detectUserRole();
    this.initForms();
    this.fetchTargetProfile();
  }

  detectUserRole(): void {
    this.userRole = this.authService.getRole()?.toLowerCase().trim() || '';
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    if (newPass && confirmPass && newPass !== confirmPass) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  // Routes requests depending on detected account authorization tier
  fetchTargetProfile(): void {
    if (this.userRole === 'admin') {
      this.fetchAdminProfileData();
    } else if (this.userRole === 'staff') {
      this.fetchStaffProfileData();
    } else {
      this.populateFromLocalCache();
    }
  }

  fetchAdminProfileData(): void {
    this.isLoadingData = true;
    this.isLoading = true;
    this.cdr.detectChanges();

    this.authService.getAdminProfile().subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) {
          // Adjust logic based on whether backend exposes flat properties or nested account documents
          const targetUser = data.accountId || data;
          const nameParts = (targetUser.name || 'System Admin').split(' ');

          this.currentUser = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: targetUser.email || '',
            phone: targetUser.phone || '',
          };
        }
        this.isLoadingData = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to parse remote admin profile integration:', err);
        this.populateFromLocalCache();
        this.isLoadingData = false;
        this.cdr.detectChanges();
      },
    });
  }

  fetchStaffProfileData(): void {
    this.isLoadingData = true;
    this.isLoading = true;
    this.cdr.detectChanges();

    this.authService.getStaffProfile().subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) {
          this.staffInfo = {
            department: data.department || 'Unassigned',
            shift: data.shift || 'Standard Shift',
            salary: data.salary ? `${data.salary} EGP` : 'Confidential',
            nationalId: data.nationalId || 'N/A',
          };


          const targetUser = data.accountId || data;
          const nameParts = (targetUser.name || 'User Name').split(' ');

          this.currentUser = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: targetUser.email || '',
            phone: targetUser.phone || '',
          };
        }
        this.isLoadingData = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API integration exception while retrieving staff profile:', err);
        this.staffInfo = {
          department: 'Unavailable',
          shift: 'Unavailable',
          salary: 'Confidential',
          nationalId: 'Unavailable',
        };
        this.populateFromLocalCache();
        this.isLoadingData = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Seamless fallback loading mechanism reading user keys from runtime context
  populateFromLocalCache(): void {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const nameParts = (parsed.name || 'System User').split(' ');
        this.currentUser = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        };
      } catch (e) {}
    }
  }

  // --- Handlers ---
  openProfileModal(): void {
    this.errorMessage = '';
    this.profileForm.patchValue({
      email: this.currentUser.email,
      phone: this.currentUser.phone,
    });
    this.isEditProfileModalOpen = true;
    this.cdr.detectChanges();
  }

  closeProfileModal(): void {
    this.isEditProfileModalOpen = false;
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSavingProfile = true;
    this.cdr.detectChanges();

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.currentUser.email = this.profileForm.value.email;
        this.currentUser.phone = this.profileForm.value.phone;
        this.successMessage = 'Profile updated successfully.';
        this.closeProfileModal();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.errorMessage = err.error?.message || 'Update failed.';
        this.cdr.detectChanges();
      },
    });
  }

  openPasswordModal(): void {
    this.errorMessage = '';
    this.passwordForm.reset();
    this.isEditPasswordModalOpen = true;
    this.cdr.detectChanges();
  }

  closePasswordModal(): void {
    this.isEditPasswordModalOpen = false;
    this.cdr.detectChanges();
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isSavingPassword = true;
    this.cdr.detectChanges();

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.updatePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.isSavingPassword = false;
        this.successMessage = 'Password changed successfully.';
        this.closePasswordModal();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.errorMessage = err.error?.message || 'Incorrect current password.';
        this.cdr.detectChanges();
      },
    });
  }

  get profileImage(): string {
    const gender = this.authService.getUserGender();
    return gender === 'female' ? '/images/female-avatar.png' : '/images/male-avatar.png';
  }
}
