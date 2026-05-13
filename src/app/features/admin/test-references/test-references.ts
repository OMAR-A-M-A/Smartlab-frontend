import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TestReferenceModal } from '../../../shared/components/test-reference-modal/test-reference-modal';
import { TestRef } from '../../../core/services/test-reference/test-ref';

@Component({
  selector: 'app-test-references',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './test-references.html'
})
export class TestReferences implements OnInit {
  
  tests: any[] = []; 

  constructor(
    private dialog: MatDialog,
    private testService: TestRef 
  ) {}

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.testService.getAllReferences().subscribe({
      next: (res) => {
        this.tests = res.data;
      }
    });
  }

  
  openAddModal() {
    const dialogRef = this.dialog.open(TestReferenceModal, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
     
      this.testService.createReference(result).subscribe(() => {
        this.loadTests(); 
      });
    });
  }

  openEditModal(test: any) {
    const dialogRef = this.dialog.open(TestReferenceModal, {
      width: '600px',
      data: { test } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.testService.updateReference(test._id, result).subscribe(() => {
        this.loadTests();
      });
    });
  }

  deleteTest(id: string) {
    if(confirm('Are you sure you want to delete?')) {
      this.testService.deleteReference(id).subscribe(() => {
        this.loadTests();
      });
    }
  }
}