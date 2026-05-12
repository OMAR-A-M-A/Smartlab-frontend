import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'https://smartlab-production-c511.up.railway.app';

  constructor(private http: HttpClient) {}

  //function to fetch in auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/registerPatient`, userData);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/forgotPassword`, data);
  }

  resetPassword(token: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/account/resetPassword/${token}`, data);
  }

  updatePassword(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/account/updatePassword`, data);
  }

  updateProfile(profileData: { email?: string; phone?: string }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/account/updateProfile`, profileData);
  }

  //functions to use in auth
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  saveUserName(name: string): void {
    localStorage.setItem('userName', name);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getUserGender(): string | null {
    return localStorage.getItem('userGender');
  }
}
