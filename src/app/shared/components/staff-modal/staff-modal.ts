import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

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
    MatDialogActions],
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
  }
  nextStep() {
    if (this.accountForm.invalid) return;

    this.loading = true;
    const accountData = { ...this.accountForm.value, role: 'staff' };

    this.staffService.registerStaffAccount(accountData).subscribe({
      next: (res: any) => {
        this.accountId = res.data?.id || res.data?._id;

        if (this.accountId) {
          // نستخدم setTimeout عشان نهرب من خطأ NG0100
          setTimeout(() => {
            this.step = 2;
            this.loading = false;
            this.cdr.detectChanges(); // نجبر Angular يلاحظ التغيير
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        alert(err.error?.message || 'Error creating account');
      }
    });
  }
submitJob() {
  if (this.jobForm.invalid) return;

  this.loading = true;

  this.dialogRef.close({
    accountId: this.accountId,
    job: this.jobForm.value
  });
}
}
