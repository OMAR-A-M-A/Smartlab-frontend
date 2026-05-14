import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Reports as ReportsService } from '../../../core/services/reports/reports';
import { ReportModal } from '../../../shared/components/report-modal/report-modal';

interface TestItem {
  testName: string;
  status: string;
}

interface Patient {
  _id: string;

  accountId?: {
    name?: string;
    phone?: string;
    email?: string;
  };

  gender?: string;
}

interface Report {
  _id: string;

  referredBy?: string;

  requestDate?: string;

  createdAt?: string;

  reportStatus?: string;

  tests?: TestItem[];

  patient?: Patient | null;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {

  private dialog = inject(MatDialog);

  private reportService = inject(ReportsService);

  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  reports: Report[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.loadReports();
    this.route.queryParams.subscribe(params => {

    const patientId = params['patientId'];

    if (patientId) {

      this.openCreateReportModal(patientId);

    }

    });

  }

  loadReports(): void {

    this.isLoading = true;

    this.reportService.getAllReports().subscribe({

      next: (res: any) => {

        console.log('Reports Response:', res);

        this.reports = Array.isArray(res?.data)
          ? res.data
          : [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  openAddModal(): void {

    const dialogRef = this.dialog.open(ReportModal, {
      width: '720px',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;

      this.reportService
        .createReport(result)
        .subscribe(() => this.loadReports());
    });
  }

      openEditModal(report: Report): void {

      const cleanReport = {

        _id: report._id,

        patient: report.patient?._id || '',

        referredBy: report.referredBy || '',

        reportStatus: report.reportStatus || 'Pending',

        tests: report.tests
          ? JSON.parse(JSON.stringify(report.tests))
          : [],
      };

      const dialogRef = this.dialog.open(ReportModal, {

        width: '720px',

        maxHeight: '90vh',

        data: {
          report: cleanReport,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) return;

        this.reportService
          .updateReport(report._id, result)
          .subscribe(() => this.loadReports());
      });
    }

  deleteReport(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this report?'
    );

    if (!confirmed) return;

    this.reportService
      .deleteReport(id)
      .subscribe(() => this.loadReports());
  }

  get pendingCount(): number {

    return this.reports.filter(

      (r) =>
        !r.reportStatus ||
        r.reportStatus.toLowerCase() === 'pending'

    ).length;
  }

  get completedCount(): number {

    return this.reports.filter(

      (r) =>
        r.reportStatus?.toLowerCase() === 'completed'

    ).length;
  }

  get abnormalCount(): number {

    return this.reports.filter(

      (r) =>
        r.tests?.some(
          (t) => t.status === 'H' || t.status === 'L'
        )

    ).length;
  }

  get statsCards() {

    return [

      {
        title: 'Total Reports',
        count: this.reports.length,
        icon: 'fa-file-medical',
        bg: '#eff6ff',
        color: '#3b82f6',
      },

      {
        title: 'Pending',
        count: this.pendingCount,
        icon: 'fa-clock',
        bg: '#fef9c3',
        color: '#eab308',
      },

      {
        title: 'Abnormal Results',
        count: this.abnormalCount,
        icon: 'fa-triangle-exclamation',
        bg: '#fee2e2',
        color: '#ef4444',
      },

      {
        title: 'Completed',
        count: this.completedCount,
        icon: 'fa-circle-check',
        bg: '#dcfce7',
        color: '#22c55e',
      },
    ];
  }

  openCreateReportModal(patientId?: string) {

    const dialogRef = this.dialog.open(ReportModal, {
      width: '700px',

      data: {
        patientId: patientId || null
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      // create report api here

    });

  }

}
