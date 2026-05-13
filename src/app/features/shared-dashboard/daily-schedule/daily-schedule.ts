import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // مكتبة الجدول
import { MatButtonModule } from '@angular/material/button'; // مكتبة الزراير
import { MatIconModule } from '@angular/material/icon'; // مكتبة الأيقونات
import { MatChipsModule } from '@angular/material/chips'; // عشان الـ Status بشكل شيك

@Component({
  selector: 'app-daily-schedule',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule
  ],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.css'
})
export class DailySchedule {
  isLoading = false; // لو خليتيها true هيظهر الـ Spinner
  
  appointments = [
    { id: 1, time: '09:00 AM', patientName: 'Eman Mohamed', testType: 'CBC', status: 'Pending' },
    { id: 2, time: '10:30 AM', patientName: 'Marwa Emam', testType: 'Glucose', status: 'Completed' }
  ];

  loadDailyAppointments() {
    this.isLoading = true;
    // محاكاة تحميل البيانات
    setTimeout(() => { this.isLoading = false; }, 1000);
  }

  onComplete(id: any) { console.log('Completed:', id); }
  onCancel(id: any) { console.log('Cancelled:', id); }
}