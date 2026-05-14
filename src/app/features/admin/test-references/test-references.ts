import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  TestReferenceModal
} from '../../../shared/components/test-reference-modal/test-reference-modal';

import {
  TestRef
} from '../../../core/services/test-reference/test-ref';

@Component({
  selector: 'app-test-references',

  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule
  ],

  templateUrl: './test-references.html',
  styleUrls: ['./test-references.css']
})

export class TestReferences implements OnInit {

  tests: any[] = [];

  isLoading = false;

  private cdr =
    inject(ChangeDetectorRef);

  constructor(

    private dialog: MatDialog,

    private testService: TestRef

  ) {}

  ngOnInit(): void {

    this.loadTests();

  }

  loadTests(): void {

    this.isLoading = true;

    this.cdr.detectChanges();

    this.testService
      .getAllReferences()

      .subscribe({

        next: (res) => {

          this.tests =
            res.data || [];

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: () => {

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }

  openAddModal(): void {

    const dialogRef =
      this.dialog.open(
        TestReferenceModal,
        {
          width: '600px'
        }
      );

    dialogRef
      .afterClosed()

      .subscribe((result) => {

        if (!result) return;

        this.testService
          .createReference(result)

          .subscribe({

            next: () => {

              this.loadTests();

              this.cdr.detectChanges();

            }

          });

      });

  }

  openEditModal(test: any): void {

    const dialogRef =
      this.dialog.open(
        TestReferenceModal,
        {
          width: '600px',
          data: { test }
        }
      );

    dialogRef
      .afterClosed()

      .subscribe((result) => {

        if (!result) return;

        this.testService
          .updateReference(
            test._id,
            result
          )

          .subscribe({

            next: () => {

              this.loadTests();

              this.cdr.detectChanges();

            }

          });

      });

  }

  deleteTest(id: string): void {

    if (
      confirm(
        'Are you sure you want to delete?'
      )
    ) {

      this.testService
        .deleteReference(id)

        .subscribe({

          next: () => {

            this.loadTests();

            this.cdr.detectChanges();

          }

        });

    }

  }

}
