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
    firstName: 'Mohamed',
    lastName: 'Ali Mettwally',
    email: 'alimettwally@gmail.com',
    phone: '01081111111',
  };

  // 🌟 Placeholder Staff Data (Until API is ready)
  staffInfo: any = {
    department: 'Laboratory',
    shift: 'Morning Shift',
    salary: '8,500 EGP',
    nationalId: '298XXXXXXXXXXX',
  };

  userRole: string = '';
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  isEditProfileModalOpen: boolean = false;
  isEditPasswordModalOpen: boolean = false;
  isSavingProfile: boolean = false;
  isSavingPassword: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.detectUserRole();
    this.initForms();
    this.loadUserData();
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

  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const nameParts = (parsed.name || 'User Name').split(' ');
        this.currentUser = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        };
        this.cdr.detectChanges();
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
}
