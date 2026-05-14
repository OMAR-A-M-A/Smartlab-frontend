import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Reports } from '../../../core/services/reports/reports'; 
import { ReportModal } from '../../../shared/components/report-modal/report-modal'; 

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './reports.html'
})
export class ManageReports implements OnInit {
  
  reports: any[] = []

  constructor(
    private dialog: MatDialog,
    private reportService: Reports 
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportService.getAllReports().subscribe({
      next: (res) => {
        this.reports = res.data;
      }
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(ReportModal, {
      width: '800px' // كبرنا العرض شوية عشان تفاصيل التحاليل كتير
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
     
      this.reportService.createReport(result).subscribe(() => {
        this.loadReports(); 
      });
    });
  }

  openEditModal(report: any) {
    const dialogRef = this.dialog.open(ReportModal, {
      width: '800px',
      data: { report } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.reportService.updateReport(report._id, result).subscribe(() => {
        this.loadReports();
      });
    });
  }

  deleteReport(id: string) {
    if(confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe(() => {
        this.loadReports();
      });
    }
  }
}