import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reports } from '../../../core/services/reports/reports';
import { ManagePatients as PatientService} from '../../../core/services/manage-patients/manage-patients';
import { Booking } from '../../../core/services/booking/booking';
import { ManageStaffServices } from '../../../core/services/staff/staff-services';
import { TestRef } from '../../../core/services/test-reference/test-ref';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private reportsService = inject(Reports);
  private patientService = inject(PatientService);
  private bookingService = inject(Booking);
  private cdr = inject(ChangeDetectorRef);
  private testRefService = inject(TestRef);
  private staffService = inject(ManageStaffServices);

  isLoading = true;

  totalReports = 0;
  dangerousReports = 0;
  totalPatients = 0;
  totalAppointments = 0;
  totalReferences = 0;
  totalStaff = 0;

  completedReports = 0;
  readyReports = 0;
  inProgressReports = 0;

  get statsCards() {
    return [
      {
        title: 'Total Reports',
        value: this.totalReports,
        icon: 'fa-regular fa-file-lines',
        bg: '#eff6ff',
        color: '#3b82f6',
      },
      {
        title: 'Dangerous Reports',
        value: this.dangerousReports,
        icon: 'fa-solid fa-triangle-exclamation',
        bg: '#fee2e2',
        color: '#ef4444',
      },
      {
        title: 'Total Patients',
        value: this.totalPatients,
        icon: 'fa-solid fa-user-injured',
        bg: '#f3e8ff',
        color: '#a855f7',
      },
      {
        title: 'Daily Appointments',
        value: this.totalAppointments,
        icon: 'fa-regular fa-calendar',
        bg: '#fef9c3',
        color: '#eab308',
      },
      {
        title: 'Test References',
        value: this.totalReferences,
        icon: 'fa-solid fa-microscope',
        bg: '#dcfce7',
        color: '#22c55e',
      },
      {
        title: 'Staff Members',
        value: this.totalStaff,
        icon: 'fa-solid fa-user-doctor',
        bg: '#fff7ed',
        color: '#f97316',
      },
    ];
  }

  chartOptions: any = {
    series: [0, 0, 0],
    labels: ['Sent to patient (completed)', 'Ready to send', 'In-Progress'],
    colors: ['#22c55e', '#1e293b', '#eab308'],
    chart: { type: 'donut', height: 250, fontFamily: 'Inter, sans-serif' },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true, fontSize: '12px', color: '#64748b', offsetY: -5 },
            value: { show: true, fontSize: '22px', fontWeight: 600, color: '#1e293b', offsetY: 5 },
            total: {
              show: true,
              showAlways: true,
              label: 'overall',
              formatter: (w: any) =>
                w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, colors: ['#fff'], width: 4 },
    legend: { show: false },
    tooltip: { enabled: true, y: { formatter: (val: number) => val.toString() } },
  };

  ngOnInit(): void {
    this.isLoading = true;

    const today = new Date().toISOString().split('T')[0];

    forkJoin({
      reports: this.reportsService.getAllReports().pipe(catchError(() => of(null))),
      dangerous: this.reportsService.getDangerousReports().pipe(catchError(() => of(null))),
      patients: this.patientService.getAllPatients().pipe(catchError(() => of(null))),
      appointments: this.bookingService.getDailySchedule(today).pipe(catchError(() => of(null))),
      references: this.testRefService.getAllReferences().pipe(catchError(() => of(null))),
      staff: this.staffService.getAllStaff().pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ reports, dangerous, patients, appointments, references, staff }) => {
        this.totalReports = reports?.results ?? reports?.data?.length ?? 0;
        this.dangerousReports = dangerous?.results ?? dangerous?.data?.length ?? 0;
        this.totalPatients = patients?.results ?? patients?.data?.length ?? 0;
        this.totalAppointments = appointments?.results ?? appointments?.data?.length ?? 0;
        this.totalReferences = references?.results ?? references?.data?.length ?? 0;
        this.totalStaff = staff?.results ?? staff?.data?.length ?? 0;

        const reportsData: any[] = reports?.data || [];
        this.completedReports = reportsData.filter(
          (r) =>
            r.reportStatus?.toLowerCase() === 'sent' ||
            r.reportStatus?.toLowerCase() === 'completed',
        ).length;
        this.readyReports = reportsData.filter(
          (r) => r.reportStatus?.toLowerCase() === 'ready',
        ).length;
        this.inProgressReports = reportsData.filter(
          (r) =>
            r.reportStatus?.toLowerCase() === 'in-progress' ||
            r.reportStatus?.toLowerCase() === 'pending',
        ).length;

        this.chartOptions = {
          ...this.chartOptions,
          series: [this.completedReports, this.readyReports, this.inProgressReports],
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
