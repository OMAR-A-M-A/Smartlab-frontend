import { Component, OnInit, ViewChild , ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ManagePatients as ManPatient } from '../../../core/services/manage-patients/manage-patients';
import { PatientModal } from './../../../shared/components/patient-modal/patient-modal';
import { SharedPopup } from '../../../shared/components/shared-popup/shared-popup';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './manage-patients.html',
  styleUrl: './manage-patients.css',
})
export class ManagePatients implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'age',
    'weight',
    'height',
    'chronicDiseases',
    'previousSurgeries',
    'medications',
    'isSmoker',
    'actions',
  ];

  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private PatientService: ManPatient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.isLoading = true;
    this.PatientService.getAllPatients().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.dataSource.data = res.data.patients || [];

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const search = filter.trim().toLowerCase();
          return (
            data.accountId?.name?.toLowerCase().includes(search) ||
            data.accountId?.email?.toLowerCase().includes(search) ||
            data.accountId?.patientId?.toLowerCase().includes(search)
          );
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load patients list:', err);
        this.showMessage('Failed to load patient records.', true);
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddModal() {
    const dialogRef = this.dialog.open(PatientModal, { width: '600px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const payload = {
        accountId: result.accountId,
        ...result.medicalData,
      };

      this.PatientService.createPatient(payload).subscribe({
        next: (res) => {
          this.loadPatients();

          // التقاط الأسماء والمعرفات لفتح النافذة المنبثقة المخصصة
          const patientName = res?.data?.accountId?.name || result.accountId?.name || 'New Patient';
          const generatedId = res?.data?.accountId?.patientId || res?.data?._id || '#AD-45532';

          this.openPatientCreatedPopup(patientName, generatedId);
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Failed to add patient', true);
        },
      });
    });
  }

  openEditModal(patient: any) {
    const dialogRef = this.dialog.open(PatientModal, {
      width: '600px',
      data: { patient },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !result.medicalData) return;

      this.PatientService.updatePatient(patient._id, result.medicalData).subscribe({
        next: () => {
          this.loadPatients();

          const patientName = patient.accountId?.name || 'Patient';
          this.openResultsUpdatedPopup(patientName);
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Failed to update patient', true);
        },
      });
    });
  }

  deletePatient(id: string, patientName?: string) {
    const targetName = patientName || 'this patient';

    const dialogRef = this.dialog.open(SharedPopup, {
      panelClass: 'custom-dialog-container',
      data: {
        type: 'danger',
        title: 'Are You Sure You Want Delete Patient Records ?',
        fullDescription: `By pressing confirm, you will permanently lose records for ${targetName}.`,
        showClose: true,
        actions: [
          { label: 'Delete Records', type: 'danger', value: 'confirm_delete' },
          { label: 'Keep Records', type: 'primary', value: 'cancel' },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((actionValue) => {
      if (actionValue === 'confirm_delete') {
        this.PatientService.deletePatient(id).subscribe({
          next: () => {
            this.loadPatients();
            this.showMessage('Patient records deleted successfully.');
          },
          error: (err) => {
            this.showMessage(err.error?.message || 'Failed to delete patient', true);
          },
        });
      }
    });
  }

  // التوجيه السريع لإنشاء التقارير (تمت إضافته من الفرع الرئيسي)
  goToCreateReport(patient: any) {
    this.router.navigate(['/staff/reports'], {
      queryParams: { patientId: patient._id },
    });
  }

  private openPatientCreatedPopup(patientName: string, generatedId: string): void {
    const dialogRef = this.dialog.open(SharedPopup, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: {
        type: 'success',
        title: 'Patient Records Added Successfully!',
        descriptionTextBeforeName: 'The record for ',
        patientName: patientName,
        descriptionTextAfterName: ' has been created and the Access ID has been generated',
        patientId: generatedId,
        showClose: true,
        actions: [
          { label: 'View Patient', type: 'outline', value: 'view' },
          { label: 'Go Dashboard', type: 'primary', value: 'dashboard' },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((actionValue) => {
      if (actionValue === 'dashboard') {
        this.router.navigate(['/staff/dashboard']);
      }
    });
  }

  private openResultsUpdatedPopup(patientName: string): void {
    this.dialog.open(SharedPopup, {
      panelClass: 'custom-dialog-container',
      data: {
        type: 'success',
        title: 'Patient Records Updated Successfully!',
        descriptionTextBeforeName: 'The medical data for ',
        patientName: patientName,
        descriptionTextAfterName: ' has been saved and is active.',
        showClose: true,
        actions: [{ label: 'Continue', type: 'primary', value: 'close' }],
      },
    });
  }

  showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}
