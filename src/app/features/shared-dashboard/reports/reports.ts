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
  accountId?: { name?: string; phone?: string; email?: string };
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
  private dialog        = inject(MatDialog);
  private reportService = inject(ReportsService);
  private cdr           = inject(ChangeDetectorRef);
  private route         = inject(ActivatedRoute);

  reports: Report[] = [];
  isLoading = false;
  filterByPatient = '';

  ngOnInit(): void {
    // أول حاجة نقرأ الـ params، وبعدين نجيب الداتا
    this.route.queryParams.subscribe((params) => {
      this.filterByPatient = params['patientId'] || '';
      const reportId       = params['reportId']  || '';
      this.loadReports(reportId);
    });
  }

  get filteredReports(): Report[] {
    if (!this.filterByPatient) return this.reports;
    return this.reports.filter(
      (r) => r.patient?._id === this.filterByPatient,
    );
  }

  clearFilter(): void {
    this.filterByPatient = '';
    this.cdr.detectChanges();
  }

  loadReports(autoOpenReportId?: string): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.reportService.getAllReports().subscribe({
      next: (res: any) => {
        this.reports  = Array.isArray(res?.data) ? res.data : [];
        this.isLoading = false;
        this.cdr.detectChanges();

        // لو في reportId في الـ URL افتح الـ edit modal تلقائياً
        if (autoOpenReportId) {
          const report = this.reports.find((r) => r._id === autoOpenReportId);
          if (report) {
            setTimeout(() => this.openEditModal(report), 300);
          }
        }
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
      this.reportService.createReport(result).subscribe(() => this.loadReports());
    });
  }

  openEditModal(report: Report): void {
    const cleanReport = {
      _id:          report._id,
      patient:      report.patient?._id || '',
      referredBy:   report.referredBy   || '',
      reportStatus: report.reportStatus || 'Pending',
      tests:        report.tests ? JSON.parse(JSON.stringify(report.tests)) : [],
    };

    const dialogRef = this.dialog.open(ReportModal, {
      width:     '720px',
      maxHeight: '90vh',
      data: { report: cleanReport },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.reportService
        .updateReport(report._id, result)
        .subscribe(() => this.loadReports());
    });
  }

  deleteReport(id: string): void {
    if (!confirm('Are you sure you want to delete this report?')) return;
    this.reportService.deleteReport(id).subscribe(() => this.loadReports());
  }

  // ===== Stats =====
  get pendingCount(): number {
    return this.reports.filter(
      (r) => !r.reportStatus || r.reportStatus.toLowerCase() === 'pending',
    ).length;
  }

  get completedCount(): number {
    return this.reports.filter(
      (r) => r.reportStatus?.toLowerCase() === 'completed',
    ).length;
  }

  get abnormalCount(): number {
    return this.reports.filter(
      (r) => r.tests?.some((t) => t.status === 'H' || t.status === 'L'),
    ).length;
  }

  get statsCards() {
    return [
      { title: 'Total Reports',    count: this.reports.length, icon: 'fa-file-medical',        bg: '#eff6ff', color: '#3b82f6' },
      { title: 'Pending',          count: this.pendingCount,   icon: 'fa-clock',                bg: '#fef9c3', color: '#eab308' },
      { title: 'Abnormal Results', count: this.abnormalCount,  icon: 'fa-triangle-exclamation', bg: '#fee2e2', color: '#ef4444' },
      { title: 'Completed',        count: this.completedCount, icon: 'fa-circle-check',         bg: '#dcfce7', color: '#22c55e' },
    ];
  }
}
