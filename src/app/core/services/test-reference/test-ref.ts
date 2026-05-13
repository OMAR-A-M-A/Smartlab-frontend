import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestRef {
  private baseUrl = 'https://smartlab-production-55e4.up.railway.app';

  constructor(private http: HttpClient) {}

  /*
  Endpoint: GET /ref
  Access: Admin Only
  */
  getAllReferences(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ref`);
  }

  /*
  Endpoint: POST /ref
  Access: Admin Only
  */
  createReference(refData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ref`, refData);
  }

  /*
  Endpoint: PATCH /ref/:id
  Access: Admin Only
  */
  updateReference(id: string, refData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ref/${id}`, refData);
  }

  /*
  Endpoint: DELETE /ref/:id
  Access: Admin Only
  */
  deleteReference(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ref/${id}`);
  }
}
