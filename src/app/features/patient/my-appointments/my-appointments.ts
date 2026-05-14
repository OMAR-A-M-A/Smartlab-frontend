import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Booking } from '../../../core/services/booking/booking';

import { MyAppointment } from '../../../shared/interfaces/appointment.interface';

@Component({
  selector: 'app-my-appointments',

  imports: [CommonModule],

  templateUrl: './my-appointments.html',

  styleUrl: './my-appointments.css',
})

export class MyAppointments implements OnInit {

  private bookingService = inject(Booking);

  private snackBar = inject(MatSnackBar);

  private cdr = inject(ChangeDetectorRef);

  appointments: MyAppointment[] = [];

  isLoading: boolean = false;

  cancellingId: string | null = null;

  ngOnInit(): void {

    this.loadAppointments();

  }

  loadAppointments(): void {

    this.isLoading = true;

    this.cdr.detectChanges();

    this.bookingService
      .getPatientAppointments()

      .subscribe({

        next: (res) => {

          this.appointments =
            res?.data || [];

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.isLoading = false;

          this.cdr.detectChanges();

          const errorMsg =

            err.error?.message ||

            'Failed to load appointments.';

          this.snackBar.open(
            errorMsg,
            'Close',
            {
              duration: 3000
            }
          );

        },

      });

  }

  cancelAppointment(appt: MyAppointment): void {

    if (!appt._id) return;

    this.cancellingId = appt._id;

    this.cdr.detectChanges();

    const normalizedDate =
      this.toISODate(
        appt.appointmentDate
      );

    this.bookingService
      .cancelAppointment({

        appointmentDate:
          normalizedDate,

        time: appt.time,

      })

      .subscribe({

        next: () => {

          appt.status =
            'cancelled';

          this.cancellingId = null;

          this.cdr.detectChanges();

          this.snackBar.open(

            'Appointment cancelled successfully.',

            'Close',

            {
              duration: 3000
            }

          );

        },

        error: (err) => {

          this.cancellingId = null;

          this.cdr.detectChanges();

          const errorMsg =

            err.error?.message ||

            'Failed to cancel appointment.';

          this.snackBar.open(
            errorMsg,
            'Close',
            {
              duration: 3000
            }
          );

        },

      });

  }

  private toISODate(
    dateStr: string
  ): string {

    if (
      /^\d{4}-\d{2}-\d{2}$/
        .test(dateStr)
    ) {

      return dateStr;

    }

    const date =
      new Date(dateStr);

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  formatDate(
    dateStr: string
  ): string {

    if (
      /^\d{4}-\d{2}-\d{2}$/
        .test(dateStr)
    ) {

      const [
        year,
        month,
        day
      ] = dateStr
        .split('-')
        .map(Number);

      const date =
        new Date(
          year,
          month - 1,
          day
        );

      return date
        .toLocaleDateString(
          'en-US',
          {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }
        );

    }

    const date =
      new Date(dateStr);

    if (
      isNaN(date.getTime())
    ) {

      return dateStr;

    }

    return date
      .toLocaleDateString(
        'en-US',
        {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );

  }

}
