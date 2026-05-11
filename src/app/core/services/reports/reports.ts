import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ReportResponse , Report} from '../../../shared/interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class Reports {
  getPatientProfile() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'https://smartlab-back-production.up.railway.app';

  constructor(private http: HttpClient) {}

  /*
  Endpoint: POST /reports
  Access: Admin / Staff
  */
  createReport(reportData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reports`, reportData);
  }

  /*
  Endpoint: GET /reports
  Access: Admin / Staff
  */
  getAllReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports`);
  }

  /*
  Endpoint: GET /reports/dangerous
  Access: Admin Only
  */
  getDangerousReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/dangerous`);
  }

  /*
  Endpoint: GET /reports/patient
  Access: Patient Only
  */
  getPatientReports(): Observable<Report[]> {

  return this.http
    .get<ReportResponse>(`${this.baseUrl}/reports/patient`)
    .pipe(

      tap((response) => {
        console.log('FULL API RESPONSE:', response);
      }),

      map((response) => {

        if (!response || !response.data) {
          return [];
        }

        return response.data;
      })

    );
}

  /*
  Endpoint: PATCH /reports/:id
  Access: Admin / Staff
  */
  updateReport(id: string, updateData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/reports/${id}`, updateData);
  }

  /*
  Endpoint: DELETE /reports/:id
  Access: Admin / Staff
  */
  deleteReport(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reports/${id}`);
  }

  /*
  Endpoint: POST /reports/:id/send
  Access: Admin / Staff
  */
  sendReportEmail(id: string, emailData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reports/${id}/send`, emailData);
  }
}
