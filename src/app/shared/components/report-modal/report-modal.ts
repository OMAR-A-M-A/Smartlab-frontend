import { Component, Inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-modal',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],

  templateUrl: './report-modal.html',

  styleUrl: './report-modal.css',
})
export class ReportModal implements OnInit {

  reportForm!: FormGroup;

  isEditMode = false;

  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<ReportModal>,

    @Inject(MAT_DIALOG_DATA)
    public data: any,

  ) {
    this.initForm();
  }

  ngOnInit(): void {

  setTimeout(() => {

    if (this.data?.patientId) {

      this.reportForm.patchValue({

        patient: this.data.patientId

      });

      console.log('PATIENT ID:', this.data.patientId);

    }

    if (this.data?.patientData) {

      console.log(
        'PATIENT DATA:',
        this.data.patientData
      );

    }

  }, 0);

  if (this.data?.report) {

    this.isEditMode = true;

    this.patchValues(this.data.report);

  }

}

  initForm(): void {

    this.reportForm = this.fb.group({

      patient: [
        '',
        Validators.required,
      ],

      referredBy: [
        '',
        Validators.required,
      ],

      reportStatus: [
        'Pending',
      ],

      patientAdvice: [''],

      tests: this.fb.array([]),
    });

    if (!this.isEditMode) {
      this.addTest();
    }
  }

  get tests(): FormArray {

    return this.reportForm.get(
      'tests'
    ) as FormArray;
  }

  addTest(): void {

    const testGroup = this.fb.group({
      testId: [''],
      testName: [
        '',
        Validators.required,
      ],

      category: [
        '',
        Validators.required,
      ],

      result: [
        0,
        Validators.required,
      ],

      unit: [
        '',
        Validators.required,
      ],

      referenceRange: this.fb.group({

        low: [0],

        high: [0],
      }),

      status: ['N'],

      critical: [false],

      patientAdvice: [''],
    });

    this.tests.push(testGroup);
  }

  removeTest(index: number): void {

    this.tests.removeAt(index);
  }

  patchValues(report: any): void {

  const patientId =
    typeof report.patient === 'object'
      ? report.patient?._id
      : report.patient;

  this.reportForm.patchValue({

    patient: patientId || '',

    referredBy:
      report.referredBy || '',

    patientAdvice:
      report.patientAdvice || '',

    reportStatus:
      report.reportStatus || 'Pending',
  });

  this.tests.clear();

  report.tests?.forEach((t: any) => {

    this.tests.push(

      this.fb.group({

        testId: [
          t.testId || t.test || '',
        ],

        testName: [
          t.testName || '',
          Validators.required,
        ],

        category: [
          t.category || '',
          Validators.required,
        ],

        result: [
          t.result || 0,
          Validators.required,
        ],

        unit: [
          t.unit || '',
          Validators.required,
        ],

        referenceRange: this.fb.group({

          low: [
            t.referenceRange?.low || 0,
          ],

          high: [
            t.referenceRange?.high || 0,
          ],
        }),

        status: [
          t.status || 'N',
        ],

        critical: [
          t.critical || false,
        ],

        patientAdvice: [
          t.patientAdvice || '',
        ],
      })
    );
  });
}

  submit(): void {

    if (this.reportForm.valid) {

      this.dialogRef.close(
        this.reportForm.value
      );

    } else {

      this.reportForm.markAllAsTouched();
    }
  }

  closeModal(): void {

    this.dialogRef.close();
  }
}
