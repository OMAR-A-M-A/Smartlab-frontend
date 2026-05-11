import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Reports } from '../../../core/services/reports/reports';

import {
  Patient as PatientService
} from '../../../core/services/patient/patient';

import {
  Report,
  ReportTest
} from '../../../shared/interfaces/report.interface';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reports.html',
  styleUrls: ['./my-reports.css']
})
export class MyReports implements OnInit {

  @ViewChild('reportContent')
  reportContent!: ElementRef;

  private patientService = inject(PatientService);
  private reportsService = inject(Reports);
  private cdr = inject(ChangeDetectorRef);

  reports: Report[] = [];

  selectedReport: Report | null = null;

  isLoading = false;

  error: string | null = null;

  patientName = '';

  patientEmail = '';


  ngOnInit(): void {

    this.loadReports();

    this.patientService
      .getPatientProfile()
      .subscribe({

        next: (response) => {

          this.patientName =
            response.data.patient.accountId.name
            || 'Unknown';

          this.patientEmail =
            response.data.patient.accountId.email
            || 'No Email';
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  loadReports(): void {

    this.isLoading = true;

    this.error = null;

    this.reportsService
      .getPatientReports()
      .subscribe({

        next: (data: Report[]) => {

          this.reports = [...data];

          if (this.reports.length > 0) {
            this.selectedReport =
              this.reports[0];
          }

          this.isLoading = false;

          this.cdr.detectChanges();

          console.log(this.selectedReport);
        },

        error: (err) => {

          console.error(err);

          this.error =
            'Failed to load reports';

          this.isLoading = false;

          this.cdr.detectChanges();
        }
      });
  }

  selectReport(report: Report): void {
    this.selectedReport = report;
  }

  downloadReport(): void {

    const data =
      this.reportContent.nativeElement;

    html2canvas(data, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {

      const pdf =
        new jsPDF('p', 'mm', 'a4');

      const patientName =
        this.patientName || 'Unknown';

      const patientEmail =
        this.patientEmail || 'No Email';

      pdf.setFontSize(18);

      pdf.text(
        `Patient: ${patientName}`,
        10,
        10
      );

      pdf.setFontSize(12);

      pdf.text(
        `Email: ${patientEmail}`,
        10,
        17
      );


      const pageWidth = 210;

      const pageHeight = 297;

      const marginX = 10;

      const marginTop = 30;

      const contentWidth =
        pageWidth - (marginX * 2);

      const contentHeight =
        (canvas.height * contentWidth)
        / canvas.width;

      const imgData =
        canvas.toDataURL('image/png');

      let heightLeft =
        contentHeight;

      let position =
        marginTop;


      pdf.addImage(
        imgData,
        'PNG',
        marginX,
        position,
        contentWidth,
        contentHeight
      );

      heightLeft -=
        (pageHeight - marginTop);

      while (heightLeft > 0) {

        position =
          heightLeft -
          contentHeight +
          marginTop;

        pdf.addPage();


        pdf.setFontSize(18);

        pdf.text(
          `Patient: ${patientName}`,
          10,
          10
        );

        pdf.setFontSize(12);

        pdf.text(
          `Email: ${patientEmail}`,
          10,
          17
        );

        pdf.addImage(
          imgData,
          'PNG',
          marginX,
          position,
          contentWidth,
          contentHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save('MyReport.pdf');

    });

  }

  getStatusLabel(
    status: 'H' | 'N' | 'L'
  ): string {

    switch (status) {

      case 'H':
        return 'High';

      case 'L':
        return 'Low';

      default:
        return 'Normal';
    }
  }

  getStatusClass(
    status: 'H' | 'N' | 'L'
  ): string {

    switch (status) {

      case 'H':
        return 'status-high';

      case 'L':
        return 'status-low';

      default:
        return 'status-normal';
    }
  }

  getProgressPercent(
    test: ReportTest
  ): number {

    if (!test?.referenceRange) {
      return 0;
    }

    const low =
      test.referenceRange.low;

    const high =
      test.referenceRange.high;

    const range =
      high - low;

    if (range <= 0) {
      return 0;
    }

    const value =
      test.result - low;

    const percent =
      (value / range) * 100;

    return Math.min(
      Math.max(percent, 8),
      100
    );
  }

  getProgressColor(
    status: 'H' | 'N' | 'L'
  ): string {

    switch (status) {

      case 'H':
        return '#dc2626';

      case 'L':
        return '#2563eb';

      default:
        return '#16a34a';
    }
  }

  getOverallStatus(): string {

    if (!this.selectedReport) {
      return 'Normal';
    }

    const hasHigh =
      this.selectedReport.tests.some(
        test => test.status === 'H'
      );

    const hasLow =
      this.selectedReport.tests.some(
        test => test.status === 'L'
      );

    if (hasHigh || hasLow) {
      return 'Critical';
    }

    return 'Normal';
  }

    getOverallStatusClass(): string {

    const status =
      this.getOverallStatus();

    switch (status) {

      case 'Critical':
        return 'status-high';

      default:
        return 'status-normal';
    }
  }

  formatDate(dateStr?: string): string {

    if (!dateStr) {
      return '';
    }

    return new Date(dateStr)
      .toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
  }
}
