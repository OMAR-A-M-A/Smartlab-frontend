import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../core/services/booking/booking';
import { timer, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-daily-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-schedule.html',
  styleUrls: ['./daily-schedule.css']
})
export class DailySchedule implements OnInit, OnDestroy {
  private scheduleService = inject(Booking);
  
  appointments: any[] = [];

  
  selectedDate: string = new Date().toISOString().split('T')[0];
  loading = false;
  private pollingSub?: Subscription;

  ngOnInit() {
    this.startPolling();
  }

  startPolling() {
    this.pollingSub = timer(0, 30000)
      .pipe(
        switchMap(() => {
          this.loading = true; 
          return this.scheduleService.getDailySchedule(this.selectedDate);
        })
      )
      .subscribe({
        next: (res) => {
          this.appointments = res.data; 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching appointments:', err);
          this.loading = false;
        }
      });
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.scheduleService.getDailySchedule(this.selectedDate).subscribe({
      next: (res) => {
        this.appointments = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }
getStats(type: 'total' | 'cancelled' | 'home'): number {
  if (!this.appointments) return 0;
  
  switch(type) {
    case 'total': return this.appointments.length;
    case 'cancelled': return this.appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length;
    case 'home': return this.appointments.filter(a => a.appointmentType === 'Home-Visit').length;
    default: return 0;
  }
}
}