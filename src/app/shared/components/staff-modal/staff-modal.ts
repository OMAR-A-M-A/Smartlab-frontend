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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ],
  templateUrl: './staff-modal.html',
})
export class StaffModal {
  step = 1;
  accountId!: string;
  loading = false;
  accountForm!: FormGroup;
  jobForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StaffModal>,
    private staffService: ManageStaffServices,
    private cdr: ChangeDetectorRef, // ضيف ده هنا
    private snackBar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.accountForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // متوافق مع schema: minLength 8
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^01[0125][0-9]{8}$/), // مثال لرقام الموبايل في مصر، أو اتركه Validators.required فقط
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), // نفس الـ regex في الـ schema
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4), // متوافق مع schema: minlength 4
        ],
      ],
    });

    this.jobForm = this.fb.group({
      nationalId: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{14}$/), // متوافق مع schema: exactly 14 digits
        ],
      ],
      department: ['', Validators.required], // تأكد أن الـ values في الـ HTML تطابق الـ Enum
      shift: ['', Validators.required], // morning أو evening
      salary: [0, [Validators.required, Validators.min(0)]],
      bonus: [0, [Validators.min(0)]],
      payDay: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(31), // متوافق مع schema: min 1, max 31
        ],
      ],
    });
    // في البداية اسمح بالخروج بالضغط بره (Backdrop)
    this.dialogRef.disableClose = false;
    // التحقق هل نحن في وضع التعديل؟
    if (this.data && this.data.staff) {
      this.isEditMode = true;
      this.step = 2; // ابدأ من الخطوة الثانية فوراً في التعديل
      this.dialogRef.disableClose = true; // امنع القفل العشوائي بالتعديل بردو
      this.patchValues(this.data.staff);
    } else {
      this.dialogRef.disableClose = false; // في الإضافة اسمح بالقفل في أول خطوة
    }
  }

  private patchValues(staff: any) {
    // تعبئة بيانات الأكاونت (اختياري حسب الـ API عندك)
    this.accountForm.patchValue({
      name: staff.accountId?.name,
      email: staff.accountId?.email,
      phone: staff.accountId?.phone,
      password: '*****', // كلمة السر لا تأتي من الـ API عادة
    });

    // تعبئة بيانات الوظيفة
    this.jobForm.patchValue({
      nationalId: staff.nationalId,
      department: staff.department,
      shift: staff.shift,
      salary: staff.salary,
      bonus: staff.bonus,
      payDay: staff.payDay,
    });
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
        this.showMessage('Account created successfully');
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
        this.showMessage(err.error?.message || 'Registration failed', true);
      },
    });
  }
  cancelRegistration() {
    if (this.isEditMode) {
      this.dialogRef.close();
      return;
    }

    // المنطق القديم للمسح في حالة الإضافة الجديدة
    if (!this.accountId) {
      this.dialogRef.close();
      return;
    }
    this.loading = true;
    // نقوم بمسح الحساب الذي تم إنشاؤه في الخطوة الأولى
    this.staffService.deleteStaffAccount(this.accountId).subscribe({
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

    // إذا كنا في وضع التعديل نغلق مباشرة ببيانات الفورم
    if (this.isEditMode) {
      this.dialogRef.close({ job: this.jobForm.value });
    } else {
      // المنطق القديم للإضافة
      this.dialogRef.close({ accountId: this.accountId, job: this.jobForm.value });
    }
  }

  showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}
