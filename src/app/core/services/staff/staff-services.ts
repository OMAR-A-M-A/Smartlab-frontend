import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ManageStaffServices {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

// في ملف manage-staff-services.ts

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
  deleteStaffAccount(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/account/deleteStaff/${id}`);
  }
  deleteStaff(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staff/${id}`);
  }


  // تأكد من صحة الـ endpoint الخاص بمسح الحساب في الـ backend
}

