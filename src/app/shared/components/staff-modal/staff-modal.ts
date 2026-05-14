import { Component, Inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { ManageStaffServices } from '../../../core/services/staff/staff-services';

@Component({
  selector: 'app-staff-modal',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],

  templateUrl: './staff-modal.html',

  styleUrl: './staff-modal.css',
})

export class StaffModal {

  step = 1;

  accountId!: string;

  loading = false;

  isEditMode = false;

  accountForm: FormGroup;

  jobForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<StaffModal>,

    private staffService: ManageStaffServices,

    private cdr: ChangeDetectorRef,

    private snackBar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA)
    public data: any,

  ) {

    this.accountForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
        ],
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^01[0125][0-9]{8}$/),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ],
      ],

    });

    this.jobForm = this.fb.group({

      nationalId: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{14}$/),
        ],
      ],

      department: [
        '',
        Validators.required,
      ],

      shift: [
        '',
        Validators.required,
      ],

      salary: [
        0,
        [
          Validators.required,
          Validators.min(0),
        ],
      ],

      bonus: [
        0,
        Validators.min(0),
      ],

      payDay: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(31),
        ],
      ],

    });

    this.dialogRef.disableClose = false;

    // ===== Edit Mode =====

    if (this.data && this.data.staff) {

      this.isEditMode = true;

      this.step = 2;

      this.dialogRef.disableClose = true;

      this.patchValues(this.data.staff);

    }

  }

  private patchValues(staff: any) {

    this.accountForm.patchValue({

      name:
        staff.accountId?.name,

      email:
        staff.accountId?.email,

      phone:
        staff.accountId?.phone,

      password: '*****',

    });

    this.jobForm.patchValue({

      nationalId:
        staff.nationalId,

      department:
        staff.department,

      shift:
        staff.shift,

      salary:
        staff.salary,

      bonus:
        staff.bonus,

      payDay:
        staff.payDay,

    });

  }

  closeModal() {

    this.dialogRef.close();

  }

  nextStep() {

    if (this.accountForm.invalid) return;

    this.loading = true;

    this.staffService
      .registerStaffAccount({

        ...this.accountForm.value,

        role: 'staff',

      })

      .subscribe({

        next: (res: any) => {

          this.accountId =

            res.data?.id ||

            res.data?._id ||

            res.id ||

            res._id;

          if (!this.accountId) {

            this.loading = false;

            this.showMessage(
              'Failed to retrieve account ID',
              true
            );

            return;

          }

          this.loading = false;

          this.step = 2;

          this.dialogRef.disableClose = true;

          this.showMessage(
            'Account created successfully'
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.loading = false;

          this.cdr.detectChanges();

          this.showMessage(

            err.error?.message ||

            'Registration failed',

            true

          );

        },

      });

  }

  cancelRegistration() {

    if (this.isEditMode) {

      this.dialogRef.close();

      return;

    }

    if (!this.accountId) {

      this.dialogRef.close();

      return;

    }

    this.loading = true;

    this.staffService
      .deleteStaffAccount(this.accountId)

      .subscribe({

        next: () => {

          this.loading = false;

          this.dialogRef.close();

        },

        error: (err) => {

          this.loading = false;

          console.error(
            'Failed to rollback account',
            err
          );

          this.dialogRef.close();

        },

      });

  }

  submitJob() {

    if (this.jobForm.invalid) {

      this.showMessage(
        'Please complete all required fields',
        true
      );

      return;

    }

    if (this.isEditMode) {

      this.dialogRef.close({

        job:
          this.jobForm.value,

      });

    } else {

      this.dialogRef.close({

        accountId:
          this.accountId,

        job:
          this.jobForm.value,

      });

    }

  }

  showMessage(
    message: string,
    isError = false
  ) {

    this.snackBar.open(

      message,

      'Close',

      {
        duration: 3000,

        panelClass: isError
          ? ['error-snackbar']
          : ['success-snackbar'],
      }

    );

  }

}
