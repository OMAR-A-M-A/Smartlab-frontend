import { PatientModal } from './../../../shared/components/patient-modal/patient-modal';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule, MatIcon } from '@angular/material/icon';
import {ManagePatients as ManPatient} from '../../../core/services/manage-patients/manage-patients';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-manage-patients',
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
  // أضف هذا السطر وتعريف أسماء الأعمدة بدقة
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

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private PatientService: ManPatient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

  ) {}

  loadPatients() {
    this.PatientService.getAllPatients().subscribe({
      next: (res) => {
        this.dataSource.data = res.data.patients;

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
      },
    });
  }

  ngOnInit() {
    this.loadPatients();
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


      // تغيير result.job إلى result.medicalData
      this.PatientService.createPatient({
        accountId: result.accountId,
        ...result.medicalData, // التأكد من الاسم هنا
      }).subscribe({
        next: () => {
          this.loadPatients();
          this.showMessage('Patient added successfully');
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

      // تحديث البيانات الطبية
      this.PatientService.updatePatient(patient._id, result.medicalData).subscribe({
        next: () => {
          this.loadPatients();
          this.showMessage('Patient updated successfully');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Failed to update patient', true);
        },
      });
    });
  }
  deletePatient(id: string) {
    this.PatientService.deletePatient(id).subscribe({
        next: () => {
          this.loadPatients();
          this.showMessage('Staff deleted successfully');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Failed to delete patient', true);
        },
      });
  }

   showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}
