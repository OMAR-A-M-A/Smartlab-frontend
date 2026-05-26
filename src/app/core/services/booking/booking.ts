import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLabSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labSettings/settings`);
  }

  getAvailableSlots(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/labSettings?date=${date}`);
  }

  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment`, appointmentData);
  }

  getPatientAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/myappointments`);
  }

  cancelAppointment(cancelData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/appointment/cancel`, cancelData);
  }

  // UPDATED
  getDailySchedule(date: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/appointment/dailySchedule`,
      { date }
    );
  }

  updateLabSchedule(scheduleData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/labSettings`, scheduleData);
  }
}
