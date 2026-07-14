import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  pin: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const API_BASE = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, payload).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, payload).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  private storeSession(res: AuthResponse) {
    localStorage.setItem('wallet_token', res.token);
    localStorage.setItem('wallet_name', res.fullName);
    localStorage.setItem('wallet_email', res.email);
    localStorage.setItem('wallet_phone', res.phoneNumber);
  }

  logout() {
    localStorage.removeItem('wallet_token');
    localStorage.removeItem('wallet_name');
    localStorage.removeItem('wallet_email');
    localStorage.removeItem('wallet_phone');
  }

  getToken(): string | null {
    return localStorage.getItem('wallet_token');
  }

  getFullName(): string {
    return localStorage.getItem('wallet_name') || '';
  }

  getPhone(): string {
    return localStorage.getItem('wallet_phone') || '';
  }

  getEmail(): string {
    return localStorage.getItem('wallet_email') || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}