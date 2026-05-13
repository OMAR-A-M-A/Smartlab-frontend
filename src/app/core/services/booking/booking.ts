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

  // Functions to fetch in Booking & Lab Settings
  /*
  Endpoint: GET /labSettings/settings
  Access: Public
   */
  getLabSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labSettings/settings`);
  }

  /*
  Endpoint: GET /labSettings?date=YYYY-MM-DD
  Access: Public
   */
  getAvailableSlots(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/labSettings?date=${date}`);
  }

  /*
  Endpoint: POST /appointment
  Access: Patient Only
   */
  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment`, appointmentData);
  }

  /*
  Endpoint: GET /appointment/myappointments
  Access: Patient Only
   */
  getPatientAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/myappointments`);
  }

  /*
  Endpoint: PATCH /appointment/cancel
  Access: Patient Only
   */
  cancelAppointment(cancelData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/appointment/cancel`, cancelData);
  }

  /*
  Endpoint: GET /appointment/dailySchedule?date=YYYY-MM-DD
  Access: Staff / Admin
  */
  getDailySchedule(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/dailySchedule?date=${date}`);
  }

  /*
  Endpoint: PATCH /labSettings
  Access: Admin Only
  */
  updateLabSchedule(scheduleData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/labSettings`, scheduleData);
  }
}
