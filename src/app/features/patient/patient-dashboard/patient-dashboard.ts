import { Component, OnInit, inject , ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../../../core/services/booking/booking';
import { Reports } from '../../../core/services/reports/reports';
import { Patient as PatientService } from '../../../core/services/patient/patient';
import { MyAppointment } from '../../../shared/interfaces/appointment.interface';
import { Report } from '../../../shared/interfaces/report.interface';

@Component({
  selector: 'app-patient-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard implements OnInit {
  private bookingService = inject(Booking);
  private reportsService = inject(Reports);
  private patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  patientName = '';
  appointments: MyAppointment[] = [];
  reports: Report[] = [];

  // ====== Computed ======
  get recentAppointments(): MyAppointment[] {
    return this.appointments.slice(0, 3);
  }
  get recentReports(): Report[] {
    return this.reports.slice(0, 3);
  }
  get totalAppointments(): number {
    return this.appointments.length;
  }
  get pendingAppointments(): number {
    return this.appointments.filter((a) => a.status === 'completed').length;
  }
  get confirmedAppointments(): number {
    return this.appointments.filter((a) => a.status === 'cancelled').length;
  }
  get totalReports(): number {
    return this.reports.length;
  }

  get statsCards() {
    return [
      {
        title: 'Total Appointments',
        value: this.totalAppointments,
        icon: 'fa-regular fa-calendar',
        bg: '#eff6ff',
        color: '#3b82f6',
      },
      {
        title: 'Pending Appointments',
        value: this.pendingAppointments,
        icon: 'fa-regular fa-clock',
        bg: '#fef9c3',
        color: '#eab308',
      },
      {
        title: 'Confirmed',
        value: this.confirmedAppointments,
        icon: 'fa-solid fa-circle-check',
        bg: '#dcfce7',
        color: '#22c55e',
      },
      {
        title: 'Total Reports',
        value: this.totalReports,
        icon: 'fa-regular fa-file-lines',
        bg: '#f3e8ff',
        color: '#a855f7',
      },
    ];
  }

    ngOnInit(): void {
      this.isLoading = true;
      this.cdr.detectChanges();

      forkJoin({
        profile: this.patientService.getPatientProfile().pipe(
          catchError(() => of(null))
        ),
        appointments: this.bookingService.getPatientAppointments().pipe(
          catchError(() => of(null))
        ),
        reports: this.reportsService.getPatientReports().pipe(
          catchError(() => of([]))
        ),
      }).subscribe({
        next: ({ profile, appointments, reports }) => {
          this.patientName = profile?.data?.patient?.accountId?.name || '';
          this.appointments = appointments?.data || [];
          this.reports = Array.isArray(reports) ? reports : [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }

    formatDate(dateStr: string): string {
      if (!dateStr) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        });
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    }

    getReportBorderClass(report: Report): string {
      const status = report.reportStatus?.toLowerCase();
      if (status === 'sent' || status === 'completed') return 'active-blue';
      return 'alert-yellow';
    }

    getReportBadgeClass(report: Report): string {
      const status = report.reportStatus?.toLowerCase();
      if (status === 'sent' || status === 'completed') return 'badge-completed';
      return 'badge-pending';
    }
}
