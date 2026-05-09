import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking } from '../../../core/services/booking/booking';
import { Auth } from '../../../core/services/auth/auth';

interface DaySlot {
  dateObj: Date;
  dayName: string; //  'Mon'
  dayNum: string; //  '12'
  fullDate: string; //  '2026-05-12'
  isDisabled: boolean;
}
@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  appointmentType: 'Lab-Visit' | 'Home-Visit' = 'Lab-Visit';
  patientAddress: string = '';

  next14Days: DaySlot[] = [];
  availableSlots: string[] = [];
  selectedDate: string = '';
  selectedTime: string = '';

  labOffDays: string[] = [];
  currentMonthLabel: string = '';
  isLoadingSlots: boolean = false;
  Math=Math;

  //(Pagination)
  currentSlotPage: number = 0;
  slotsPerPage: number = 8;
  constructor(
    private bookingService: Booking,
    private authService: Auth,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadInitialSettings();
  }

  get paginatedSlots(): string[] {
    const start = this.currentSlotPage * this.slotsPerPage;
    return this.availableSlots.slice(start, start + this.slotsPerPage);
  }

  get hasNextSlotPage(): boolean {
    return (this.currentSlotPage + 1) * this.slotsPerPage < this.availableSlots.length;
  }

  get hasPrevSlotPage(): boolean {
    return this.currentSlotPage > 0;
  }

  nextSlotPage(): void {
    if (this.hasNextSlotPage) {
      this.currentSlotPage++;
      this.cdr.detectChanges()
    }
  }

  prevSlotPage(): void {
    if (this.hasPrevSlotPage) {
      this.currentSlotPage--;
      this.cdr.detectChanges();
    }
  }

  loadInitialSettings(): void {
    this.bookingService.getLabSettings().subscribe({
      next: (res) => {
        if (res?.data?.offDays && Array.isArray(res.data.offDays)) {
          this.labOffDays = res.data.offDays.map((d: string) => d.toLowerCase());
        } else {
          this.labOffDays = ['friday'];
        }
        this.generateNext14Days();
      },
      error: (err) => {
        console.error('Failed to load lab settings, defaulting offDays to Friday', err);
        this.labOffDays = ['friday'];
        this.generateNext14Days();
      },
    });
  }

  generateNext14Days(): void {
    const days: DaySlot[] = [];
    const today = new Date();

    this.currentMonthLabel = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    for (let i = 0; i < 14; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + i);

      const fullDayName = targetDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      const shortDayName = targetDate.toLocaleString('en-US', { weekday: 'short' });

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const fullDateStr = `${year}-${month}-${day}`;

      const isDisabled = this.labOffDays.includes(fullDayName);

      days.push({
        dateObj: targetDate,
        dayName: shortDayName,
        dayNum: day,
        fullDate: fullDateStr,
        isDisabled: isDisabled,
      });
    }

    this.next14Days = days;
    this.cdr.detectChanges();
    const firstAvailable = days.find((d) => !d.isDisabled);
    if (firstAvailable) {
      this.selectDate(firstAvailable.fullDate);
    }
  }

  selectDate(dateStr: string): void {
    this.selectedDate = dateStr;
    this.selectedTime = '';
    this.availableSlots = [];
    this.isLoadingSlots = true;
    this.currentSlotPage = 0;
    this.cdr.detectChanges();

    this.bookingService.getAvailableSlots(dateStr).subscribe({
      next: (res) => {
        this.isLoadingSlots = false;
        this.availableSlots = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingSlots = false;
        this.cdr.detectChanges();
        const errorMsg = err.error?.message || 'Error loading available slots.';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
      },
    });
  }

  selectTime(timeStr: string): void {
    this.selectedTime = timeStr;
    this.cdr.detectChanges();
  }

  confirmBooking(): void {
    if (!this.selectedTime) {
      this.snackBar.open('Please select an available time slot.', 'Close', { duration: 3000 });
      return;
    }

    if (this.appointmentType === 'Home-Visit' && !this.patientAddress.trim()) {
      this.snackBar.open('Please enter your detailed address for the home visit.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const token = this.authService.getToken();
    const role = this.authService.getRole()?.toLowerCase().trim();

    if (!token || role !== 'patient') {
      this.snackBar
        .open('Please login as a patient to confirm your booking.', 'Login Now', { duration: 5000 })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/login']);
        });
      return;
    }

    const payload: any = {
      appointmentDate: this.selectedDate,
      time: this.selectedTime,
      appointmentType: this.appointmentType,
    };

    if (this.appointmentType === 'Home-Visit') {
      payload.address = this.patientAddress.trim();
    }

    this.bookingService.createAppointment(payload).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 4000 });
        this.router.navigate(['/patient/reports']);
      },
      error: (err) => {
        const errorMsg =
          err.error?.message || 'Booking failed. This slot might have just been taken.';
        this.snackBar.open(errorMsg, 'Close', { duration: 4000 });
      },
    });
  }
}
