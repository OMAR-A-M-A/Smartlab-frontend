import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reports } from '../../../core/services/reports/reports';

@Component({
  selector: 'app-dangerous-reports',
  imports: [CommonModule],
  templateUrl: './dangerous-reports.html',
  styleUrl: './dangerous-reports.css',
})
export class DangerousReports implements OnInit {
  private reportsService = inject(Reports);
  private cdr = inject(ChangeDetectorRef);

  dangerousReports: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedReport: any = null;
  isModalOpen: boolean = false;
  isSendingEmail: boolean = false;
  emailSuccessMsg: string = '';

  ngOnInit(): void {
    this.loadDangerousReports();
  }

  loadDangerousReports(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.reportsService.getDangerousReports().subscribe({
      next: (res) => {
        this.dangerousReports = res?.data || res || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dangerous reports:', err);
        this.errorMessage = 'Failed to load critical reports. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openReportModal(report: any): void {
    this.selectedReport = report;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedReport = null;
    this.cdr.detectChanges();
  }

  sendEmailNotification(report: any): void {
    if (!report?._id) return;

    this.isSendingEmail = true;
    this.emailSuccessMsg = '';
    this.cdr.detectChanges();

    const emailPayload = {
      email: report.patient?.email || '',
      subject: 'URGENT: Your Lab Report Requires Attention',
      message:
        'Your recent lab results show critical values. Please consult your doctor immediately.',
      patientName: report.patient?.name || 'Patient',
    };

    this.reportsService.sendReportEmail(report._id, emailPayload).subscribe({
      next: () => {
        this.isSendingEmail = false;
        this.emailSuccessMsg = `Alert email sent successfully to ${report.patient?.name}!`;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.emailSuccessMsg = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error('Error sending email:', err);
        this.isSendingEmail = false;
        alert('Failed to send email notification.');
        this.cdr.detectChanges();
      },
    });
  }
}
