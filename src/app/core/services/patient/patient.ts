import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Patient {
  private baseUrl = 'https://smartlab-production-55e4.up.railway.app/';

  constructor(private http: HttpClient) {}

  /*
  Endpoint: GET /patients/patientProfile
  Access: Patient Only
  */
  getPatientProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients/patientProfile`);
  }

  /*
  Endpoint: PATCH /patients/patientProfile
  Access: Patient Only
  Body: { weight, height, age }
  */
  updatePatientProfile(data: { weight: number; height: number; age: number }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/patients/patientProfile`, data);
  }
}
