import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { ManageStaffServices }
from '../../../core/services/staff/staff-services';

import { StaffModal }
from '../../../shared/components/staff-modal/staff-modal';

@Component({
  selector: 'app-manage-staff',

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
    MatSnackBarModule,
  ],

  templateUrl: './manage-staff.html',

  styleUrl: './manage-staff.css',
})

export class ManageStaff implements OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'shift',
    'salary',
    'actions'
  ];

  dataSource =
    new MatTableDataSource<any>([]);

  isLoading = false;

  private cdr =
    inject(ChangeDetectorRef);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(

    private staffService:
      ManageStaffServices,

    private dialog:
      MatDialog,

    private snackBar:
      MatSnackBar,

  ) {}

  ngOnInit() {

    this.loadStaff();

  }

  loadStaff() {

    this.isLoading = true;

    this.cdr.detectChanges();

    this.staffService
      .getAllStaff()

      .subscribe({

        next: (res) => {

          this.dataSource.data =
            res.data || [];

          this.dataSource.filterPredicate =
            (
              data: any,
              filter: string
            ) => {

              const search =
                filter.trim().toLowerCase();

              return (

                data.accountId?.name
                  ?.toLowerCase()
                  .includes(search)

                ||

                data.accountId?.email
                  ?.toLowerCase()
                  .includes(search)

              );

            };

          setTimeout(() => {

            this.dataSource.paginator =
              this.paginator;

            this.dataSource.sort =
              this.sort;

          });

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.isLoading = false;

          this.cdr.detectChanges();

          this.showMessage(

            err.error?.message ||

            'Failed to load staff',

            true

          );

        },

      });

  }

  applyFilter(event: Event) {

    const filterValue =
      (event.target as HTMLInputElement)
      .value;

    this.dataSource.filter =
      filterValue
        .trim()
        .toLowerCase();

    if (this.dataSource.paginator) {

      this.dataSource
        .paginator
        .firstPage();

    }

  }

  openAddModal() {

    const dialogRef =
      this.dialog.open(
        StaffModal,
        {
          width: '600px',
        }
      );

    dialogRef
      .afterClosed()

      .subscribe((result) => {

        if (!result) return;

        this.staffService

          .createStaffDetails({

            accountId:
              result.accountId,

            ...result.job,

          })

          .subscribe({

            next: () => {

              this.loadStaff();

              this.showMessage(
                'Staff added successfully'
              );

            },

            error: (err) => {

              this.showMessage(

                err.error?.message ||

                'Failed to add staff',

                true

              );

            },

          });

      });

  }

  openEditModal(staff: any) {

    const dialogRef =
      this.dialog.open(
        StaffModal,
        {
          width: '600px',

          data: { staff },
        }
      );

    dialogRef
      .afterClosed()

      .subscribe((result) => {

        if (!result) return;

        this.staffService

          .updateStaff(
            staff._id,
            result.job
          )

          .subscribe({

            next: () => {

              this.loadStaff();

              this.showMessage(
                'Staff updated successfully'
              );

            },

            error: (err) => {

              this.showMessage(

                err.error?.message ||

                'Failed to update staff',

                true

              );

            },

          });

      });

  }

  deleteStaff(id: string) {

    this.staffService
      .deleteStaff(id)

      .subscribe({

        next: () => {

          this.loadStaff();

          this.showMessage(
            'Staff deleted successfully'
          );

        },

        error: (err) => {

          this.showMessage(

            err.error?.message ||

            'Failed to delete staff',

            true

          );

        },

      });

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

        horizontalPosition:
          'right',

        verticalPosition:
          'bottom',

        panelClass: isError
          ? ['error-snackbar']
          : ['success-snackbar'],
      }
    );

  }

}
