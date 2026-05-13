import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reports } from '../../../core/services/reports/reports';
import { Booking } from '../../../core/services/booking/booking';
import { ManagePatients as PatientService} from '../../../core/services/manage-patients/manage-patients';
import { Auth } from '../../../core/services/auth/auth';


@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboard implements OnInit {
  private reportsService = inject(Reports);
  private bookingService = inject(Booking);
  private patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(Auth);

  staffName = '';

  isLoading = true;

  totalReports = 0;
  totalAppointments = 0;
  totalPatients = 0;

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
        title: 'Daily Appointments',
        value: this.totalAppointments,
        icon: 'fa-regular fa-calendar',
        bg: '#fef9c3',
        color: '#eab308',
      },
      {
        title: 'Total Patients',
        value: this.totalPatients,
        icon: 'fa-solid fa-user-injured',
        bg: '#f3e8ff',
        color: '#a855f7',
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
    this.staffName = this.authService.getUserName() || 'Staff';
    this.isLoading = true;
    const today = new Date().toISOString().split('T')[0];

    forkJoin({
      reports: this.reportsService.getAllReports().pipe(catchError(() => of(null))),
      appointments: this.bookingService.getDailySchedule(today).pipe(catchError(() => of(null))),
      patients: this.patientService.getAllPatients().pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ reports, appointments, patients }) => {
        this.totalReports = reports?.results ?? reports?.data?.length ?? 0;
        this.totalAppointments = appointments?.results ?? appointments?.data?.length ?? 0;
        this.totalPatients = patients?.results ?? patients?.data?.length ?? 0;

        const reportsData: any[] = reports?.data || [];
        this.completedReports = reportsData.filter((r) =>
          r.reportStatus?.toLowerCase() === 'sent' || r.reportStatus?.toLowerCase() === 'completed'
        ).length;
        this.readyReports = reportsData.filter((r) =>
          r.reportStatus?.toLowerCase() === 'ready'
        ).length;
        this.inProgressReports = reportsData.filter((r) =>
          r.reportStatus?.toLowerCase() === 'in-progress' || r.reportStatus?.toLowerCase() === 'pending'
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
