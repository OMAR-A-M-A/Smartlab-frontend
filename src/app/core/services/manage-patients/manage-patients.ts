import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export default class ManagePatients {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /*
  Endpoint: GET /patients
  Access: Admin / Staff
  */
  getAllPatients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients`);
  }
  createPatient(patientData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients`, patientData);
  }

    RegisterPatientAccount(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/registerPatient`, userData);
  }

  /*
  Endpoint: GET /patients/:id
  Access: Admin / Staff
  */
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients/${id}`);
  }

  /*
  Endpoint: PATCH /patients/:id
  Access: Admin / Staff
  */
  updatePatient(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/patients/${id}`, data);
  }

  /*
  Endpoint: DELETE /patients/:id
  Access: Admin / Staff
  */
  deletePatientAccount(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/account/deletePatient/${id}`);
  }
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patients/${id}`);
  }
}
