import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Booking } from '../../../core/services/booking/booking';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-lab-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab-settings.html',
  styleUrl: './lab-settings.css',
})
export class LabSettings implements OnInit {
  private fb = inject(FormBuilder);
  private bookingService = inject(Booking);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  // (Properties)
  currentSettings: any = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isAdmin: boolean = false;

  isEditModalOpen: boolean = false;
  settingsForm!: FormGroup;

  weekDays: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  ngOnInit(): void {
    this.checkAdminRole();
    this.initForm();
    this.loadSettings();
  }

  checkAdminRole(): void {
    const role = this.authService.getRole()?.toLowerCase().trim();
    this.isAdmin = role === 'admin';
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      slotDuration: [30, [Validators.required, Validators.min(5)]],
      offDays: [[] as string[]],
    });
  }

  loadSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.bookingService.getLabSettings().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.currentSettings = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching lab settings:', err);
        this.errorMessage = 'Failed to load lab settings. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  openEditModal(): void {
    if (!this.isAdmin) {
      this.errorMessage = 'You are not authorized to edit lab settings.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    if (this.currentSettings) {
      this.settingsForm.patchValue({
        start: this.currentSettings.workingHours?.start || '',
        end: this.currentSettings.workingHours?.end || '',
        slotDuration: this.currentSettings.slotDuration || 30,
        offDays: this.currentSettings.offDays || [],
      });
    }
    this.isEditModalOpen = true;
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.settingsForm.reset();
  }

  toggleOffDay(day: string): void {
    const currentOffDays: string[] = [...this.settingsForm.get('offDays')?.value || []];
    const index = currentOffDays.indexOf(day);

    if (index > -1) {
      currentOffDays.splice(index, 1);
    } else {
      currentOffDays.push(day);
    }
    this.settingsForm.get('offDays')?.setValue(currentOffDays);
    this.cdr.detectChanges();
  }

  isDaySelected(day: string): boolean {
    const currentOffDays: string[] = this.settingsForm.get('offDays')?.value || [];
    return currentOffDays.includes(day);
  }

  onSubmit(): void {
    if (this.settingsForm.invalid || !this.isAdmin) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    const formValues = this.settingsForm.value;

    const payload = {
      workingHours: {
        start: formValues.start,
        end: formValues.end,
      },
      slotDuration: Number(formValues.slotDuration),
      offDays: formValues.offDays,
    };

    this.bookingService.updateLabSchedule(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = 'Lab settings updated successfully!';

        if (res?.data) {
          this.currentSettings = res.data;
        } else {
          this.currentSettings = payload;
        }
        this.closeModal();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error('Error updating settings:', err);
        this.isSaving = false;
        this.errorMessage =
          'An error occurred while saving settings. Please verify your data and permissions.';
          this.cdr.detectChanges();
      },
    });
  }
}
