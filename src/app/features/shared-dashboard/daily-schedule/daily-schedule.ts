import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Booking } from '../../../core/services/booking/booking';

import {
  timer,
  Subscription,
  switchMap
} from 'rxjs';

@Component({
  selector: 'app-daily-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-schedule.html',
  styleUrls: ['./daily-schedule.css']
})
export class DailySchedule implements OnInit, OnDestroy {

  private scheduleService = inject(Booking);

  private cdr = inject(ChangeDetectorRef);

  appointments: any[] = [];

  selectedDate: string = this.getTodayDate();

  loading = false;

  private pollingSub?: Subscription;

  ngOnInit(): void {

    this.refreshData();

    this.startPolling();

  }

  startPolling(): void {

    this.pollingSub?.unsubscribe();

    this.pollingSub = timer(30000, 30000)

      .pipe(

        switchMap(() =>

          this.scheduleService.getDailySchedule(
            this.selectedDate
          )

        )

      )

      .subscribe({

        next: (res) => {

          console.log('Polling Response:', res);

          this.appointments = res?.data || [];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error fetching appointments:',
            err
          );
          this.cdr.detectChanges();

        }

      });

  }

  getTodayDate(): string {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  formatDate(dateString: string): string {

    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;

  }

  onDateChange(event: any): void {

    this.selectedDate = event.target.value;

    this.refreshData();

    this.startPolling();

  }

  refreshData(): void {

    this.loading = true;

    this.cdr.detectChanges();

    this.scheduleService
      .getDailySchedule(this.selectedDate)

      .subscribe({

        next: (res) => {

          console.log('Daily Schedule:', res);

          this.appointments = res?.data || [];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.loading = false;

          this.cdr.detectChanges();

          console.error(err);

        }

      });

  }

  ngOnDestroy(): void {

    this.pollingSub?.unsubscribe();

  }

  getStats(
    type: 'total' | 'cancelled' | 'home'
  ): number {

    if (!this.appointments) return 0;

    switch (type) {

      case 'total':

        return this.appointments.length;

      case 'cancelled':

        return this.appointments.filter(

          a =>
            a.status?.toLowerCase() ===
            'cancelled'

        ).length;

      case 'home':

        return this.appointments.filter(

          a =>
            a.appointmentType ===
            'Home-Visit'

        ).length;

      default:

        return 0;

    }

  }

}
