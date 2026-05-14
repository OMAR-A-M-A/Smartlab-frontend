// patient-modal.ts

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

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ManagePatients } from '../../../core/services/manage-patients/manage-patients';

@Component({
  selector: 'app-patient-modal',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],

  templateUrl: './patient-modal.html',

  styleUrl: './patient-modal.css',
})

export class PatientModal {

  step = 1;

  accountId!: string;

  loading = false;

  isEditMode = false;

  accountForm: FormGroup;

  medicalForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<PatientModal>,

    private patientService: ManagePatients,

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
        Validators.required,
      ],

    });

    this.medicalForm = this.fb.group({

      gender: [
        '',
        Validators.required,
      ],

      age: [
        '',
        [
          Validators.required,
          Validators.min(0),
        ],
      ],

      weight: [
        null,
        Validators.min(0),
      ],

      height: [
        null,
        Validators.min(0),
      ],

      isSmoker: [false],

      chronicDiseases: [''],

      medications: [''],

      previousSurgeries: [''],

    });

    this.dialogRef.disableClose = false;

    // Edit Mode
    if (this.data && this.data.patient) {

      this.isEditMode = true;

      this.step = 2;

      this.dialogRef.disableClose = true;

      this.patchValues(this.data.patient);

    } else {

      this.dialogRef.disableClose = false;

    }

  }

  private patchValues(patient: any) {

    this.medicalForm.patchValue({

      gender: patient.gender,

      age: patient.age,

      weight: patient.weight,

      height: patient.height,

      isSmoker: patient.isSmoker,

      chronicDiseases:
        patient.chronicDiseases?.join(', '),

      medications:
        patient.medications?.join(', '),

      previousSurgeries:
        patient.previousSurgeries?.join(', '),

    });

  }

  closeModal() {

    this.dialogRef.close();

  }

  nextStep() {

    if (this.accountForm.invalid) return;

    this.loading = true;

    this.patientService
      .RegisterPatientAccount({

        ...this.accountForm.value,

        role: 'patient',

      })

      .subscribe({

        next: (res: any) => {

          console.log(
            'Register response:',
            res
          );

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

          this.step = 2;

          this.loading = false;

          this.dialogRef.disableClose = true;

          this.showMessage(
            'Account created successfully'
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.loading = false;

          this.showMessage(

            err.error?.message ||

            'Failed to create account',

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

    this.patientService
      .deletePatientAccount(this.accountId)

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

  submit() {

    if (this.medicalForm.invalid) {

      this.showMessage(
        'Please complete all required fields',
        true
      );

      return;

    }

    const rawValues =
      this.medicalForm.value;

    const medicalData = {

      ...rawValues,

      chronicDiseases:
        rawValues.chronicDiseases

          ? rawValues.chronicDiseases
              .split(',')
              .map((s: string) => s.trim())

          : [],

      medications:
        rawValues.medications

          ? rawValues.medications
              .split(',')
              .map((s: string) => s.trim())

          : [],

      previousSurgeries:
        rawValues.previousSurgeries

          ? rawValues.previousSurgeries
              .split(',')
              .map((s: string) => s.trim())

          : [],

    };

    if (this.isEditMode) {

      this.dialogRef.close({
        medicalData
      });

    } else {

      this.dialogRef.close({

        accountId: this.accountId,

        medicalData,

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
