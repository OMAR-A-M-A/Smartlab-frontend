import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './report-modal.html',
})

export class ReportModal implements OnInit {
  reportForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
  }

  ngOnInit() {
    if (this.data && this.data.report) {
      this.isEditMode = true;
      this.patchValues(this.data.report);
    }
  }

  initForm() {
    this.reportForm = this.fb.group({
      patient: ['', Validators.required],     
      referredBy: ['', Validators.required],  
      patientAdvice: [''],                 
      tests: this.fb.array([])              
    });
  }

  get tests(): FormArray {
    return this.reportForm.get('tests') as FormArray;
  }

  addTest() {
    const testGroup = this.fb.group({
      testName: ['', Validators.required],
      category: ['', Validators.required],
      result: [0, Validators.required],
      unit: ['', Validators.required],
      referenceRange: this.fb.group({
        low: [0],
        high: [0]
      }),
      status: ['N'], 
      critical: [false],
      patientAdvice: ['']
    });
    this.tests.push(testGroup);
  }

  removeTest(index: number) {
    this.tests.removeAt(index);
  }

  patchValues(report: any) {
    this.reportForm.patchValue({
      patient: report.patient,
      referredBy: report.referredBy,
      patientAdvice: report.patientAdvice
    });
    report.tests.forEach((t: any) => {
      this.tests.push(this.fb.group({
        testName: t.testName,
        category: t.category,
        result: t.result,
        unit: t.unit,
        referenceRange: this.fb.group({
          low: t.referenceRange?.low,
          high: t.referenceRange?.high
        }),
        status: t.status,
        critical: t.critical,
        patientAdvice: t.patientAdvice
      }));
    });
  }

  submit() {
    if (this.reportForm.valid) {
      this.dialogRef.close(this.reportForm.value);
    }
  }
}