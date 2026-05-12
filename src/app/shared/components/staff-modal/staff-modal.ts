import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ManageStaffServices } from '../../../core/services/staff/staff-services';
import { ChangeDetectorRef } from '@angular/core'; // ضيف ده فوق

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogContent,
  ],
  templateUrl: './staff-modal.html',
})
export class StaffModal {
  step = 1;
  accountId!: string;
  loading = false;
  accountForm!: FormGroup;
  jobForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StaffModal>,
    private staffService: ManageStaffServices,
    private cdr: ChangeDetectorRef, // ضيف ده هنا

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.jobForm = this.fb.group({
      nationalId: ['', Validators.required],
      department: ['', Validators.required],
      shift: ['', Validators.required],
      salary: ['', Validators.required],
      bonus: [0],
      payDay: ['', Validators.required],
    });
  // في البداية اسمح بالخروج بالضغط بره (Backdrop)
  this.dialogRef.disableClose = false;
  }

  closeModal() {
  this.dialogRef.close();
}
  nextStep() {
    if (this.accountForm.invalid) return;
    this.loading = true;

    this.staffService.registerStaffAccount({ ...this.accountForm.value, role: 'staff' }).subscribe({
      next: (res: any) => {
        this.accountId = res.data?.id || res.data?._id;
        if (this.accountId) {
          setTimeout(() => {
            this.step = 2;
            this.loading = false;
            // الآن امنع الخروج بالضغط بره نهائياً لأن الحساب اتعمل
            this.dialogRef.disableClose = true;
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        alert(err.error?.message || 'Error');
      }
    });
  }
  cancelRegistration() {
    if (!this.accountId) {
      this.dialogRef.close();
      return;
    }

    this.loading = true;
    // نقوم بمسح الحساب الذي تم إنشاؤه في الخطوة الأولى
    this.staffService.deleteAccount(this.accountId).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(); // نغلق المودال بعد المسح الناجح
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to rollback account', err);
        this.dialogRef.close(); // نغلق حتى لو فشل المسح (أو اظهر رسالة خطأ)
      },
    });
  }

  submitJob() {
    if (this.jobForm.invalid) return;

    this.loading = true;

    this.dialogRef.close({
      accountId: this.accountId,
      job: this.jobForm.value,
    });
  }
}
