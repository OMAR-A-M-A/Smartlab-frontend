import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageStaffServices {
  private baseUrl = 'https://smartlab-production-c511.up.railway.app';

  constructor(private http: HttpClient) {}

  /*
  Endpoint: POST /account/registerStaff
  Access: Admin Only
  */
  registerStaffAccount(accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/registerStaff`, accountData);
  }

  /*
  Endpoint: POST /staff
  Access: Admin Only
  */
  createStaffDetails(staffData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff`, staffData);
  }

  /*
  Endpoint: GET /staff
  Access: Admin Only
  */
  getAllStaff(): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff`);
  }

  /*
  Endpoint: PATCH /staff/:id
  Access: Admin Only
  */
  updateStaff(id: string, staffData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/staff/${id}`, staffData);
  }

  /*
  Endpoint: DELETE /staff/:id
  Access: Admin Only
  */
  deleteStaff(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staff/${id}`);
  }
}
