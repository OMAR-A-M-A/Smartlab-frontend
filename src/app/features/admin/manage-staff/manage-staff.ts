import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ManageStaffServices } from '../../../core/services/staff/staff-services';
import { StaffModal } from '../../../shared/components/staff-modal/staff-modal';

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
    MatInputModule
  ],
  templateUrl: './manage-staff.html'
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

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private staffService: ManageStaffServices,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.staffService.getAllStaff().subscribe({
      next: (res) => {
        this.dataSource.data = res.data;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




openAddModal() {
  const dialogRef = this.dialog.open(StaffModal, {
    width: '600px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    this.staffService.createStaffDetails({
      accountId: result.accountId,
      ...result.job
    }).subscribe(() => {
      this.loadStaff();
    });
  });
}

  deleteStaff(id: string) {
    this.staffService.deleteStaff(id).subscribe(() => {
      this.loadStaff();
    });
  }
}
