import {
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-test-reference-modal',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './test-reference-modal.html',
  styleUrls: ['./test-reference-modal.css']
})

export class TestReferenceModal implements OnInit {

  loading = false;

  testForm!: FormGroup;

  isEditMode = false;

  applicableToOptions = [
    'Male',
    'Female',
    'Children',
    'Newborn',
    'Adults',
    'All'
  ];

  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<TestReferenceModal>,

    private cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA)
    public data: any

  ) {

    this.dialogRef.disableClose = true;

    this.initForm();

  }

  ngOnInit(): void {

    if (this.data?.test) {

      this.isEditMode = true;

      this.patchValues(this.data.test);

    }

    this.setupAutoReferenceText();

  }

  private initForm(): void {

    this.testForm = this.fb.group({

      testName: ['', Validators.required],

      category: ['', Validators.required],

      applicableTo: ['All', Validators.required],

      unit: ['', Validators.required],

      min: [null, Validators.required],

      max: [null, Validators.required],

      referenceText: ['', Validators.required],

      referral: [''],

      criticalRange: this.fb.group({

        low: [null],

        high: [null]

      }),

      adviceTemplates: this.fb.group({

        normal: ['Result is normal'],

        low: ['Low level detected'],

        high: ['High level detected'],

        critical: ['Critical level! Urgent action required']

      })

    }, {

      validators: this.rangeValidator

    });

  }

  private rangeValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const min = control.get('min')?.value;

    const max = control.get('max')?.value;

    if (
      min !== null &&
      max !== null &&
      +max <= +min
    ) {

      return { rangeError: true };

    }

    return null;

  }

  private setupAutoReferenceText(): void {

    this.testForm.valueChanges.subscribe(val => {

      if (
        val.min !== null &&
        val.max !== null &&
        val.unit
      ) {

        const text =
          `${val.min} - ${val.max} ${val.unit}`;

        this.testForm
          .get('referenceText')
          ?.setValue(text, {
            emitEvent: false
          });

      }

    });

  }

  private patchValues(test: any): void {

    this.testForm.patchValue({

      testName: test.testName,

      category: test.category,

      applicableTo: test.applicableTo,

      unit: test.unit,

      min: test.min,

      max: test.max,

      referenceText: test.referenceText,

      referral: test.referral,

      criticalRange:
        test.criticalRange || {},

      adviceTemplates:
        test.adviceTemplates || {}

    });

  }

  submit(): void {

    if (this.testForm.invalid) {

      this.testForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.cdr.detectChanges();

    setTimeout(() => {

      this.dialogRef.close(
        this.testForm.value
      );

      this.loading = false;

      this.cdr.detectChanges();

    }, 500);

  }

  closeModal(): void {

    this.dialogRef.close();

  }

}
