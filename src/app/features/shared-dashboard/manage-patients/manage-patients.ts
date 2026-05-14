import { PatientModal } from './../../../shared/components/patient-modal/patient-modal';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';

import { ManagePatients as ManPatient } from '../../../core/services/manage-patients/manage-patients';

import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private PatientService: ManPatient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.loadPatients();

  }

  loadPatients() {

  this.isLoading = true;

  this.cdr.detectChanges();

  this.PatientService.getAllPatients().subscribe({

    next: (res) => {

      this.dataSource.data = res.data.patients;

      this.dataSource.filterPredicate = (
        data: any,
        filter: string
      ) => {

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

        this.isLoading = false;

        this.cdr.detectChanges();

      });

    },

    error: (err) => {

      this.isLoading = false;

      this.cdr.detectChanges();

      this.showMessage(
        err.error?.message || 'Failed to load patients',
        true
      );

    },

  });

}

  applyFilter(event: Event) {

    const filterValue = (
      event.target as HTMLInputElement
    ).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {

      this.dataSource.paginator.firstPage();

    }

  }

  openAddModal() {

    const dialogRef = this.dialog.open(
      PatientModal,
      {
        width: '600px'
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;

      this.PatientService.createPatient({

        accountId: result.accountId,

        ...result.medicalData,

      }).subscribe({

        next: () => {

          this.loadPatients();

          this.showMessage(
            'Patient added successfully'
          );

        },

        error: (err) => {

          this.showMessage(
            err.error?.message || 'Failed to add patient',
            true
          );

        },

      });

    });

  }

  openEditModal(patient: any) {

    const dialogRef = this.dialog.open(
      PatientModal,
      {
        width: '600px',
        data: { patient },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (!result || !result.medicalData) return;

      this.PatientService.updatePatient(
        patient._id,
        result.medicalData
      ).subscribe({

        next: () => {

          this.loadPatients();

          this.showMessage(
            'Patient updated successfully'
          );

        },

        error: (err) => {

          this.showMessage(
            err.error?.message || 'Failed to update patient',
            true
          );

        },

      });

    });

  }

  deletePatient(id: string) {

    this.PatientService.deletePatient(id).subscribe({

      next: () => {

        this.loadPatients();

        this.showMessage(
          'Patient deleted successfully'
        );

      },

      error: (err) => {

        this.showMessage(
          err.error?.message || 'Failed to delete patient',
          true
        );

      },

    });

  }

  goToCreateReport(patient: any) {

    this.router.navigate(
      ['/staff/reports'],
      {
        queryParams: {
          patientId: patient._id
        }
      }
    );

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
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: isError
          ? ['error-snackbar']
          : ['success-snackbar'],
      }
    );

  }

}
