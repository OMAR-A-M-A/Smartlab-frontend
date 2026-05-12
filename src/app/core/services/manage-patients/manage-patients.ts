import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagePatients {
  private baseUrl = 'https://smartlab-production-c511.up.railway.app';

  constructor(private http: HttpClient) {}

  /*
  Endpoint: GET /patients
  Access: Admin / Staff
  */
  getAllPatients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients`);
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
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patients/${id}`);
  }
}
