import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, JwtPayload, LoginRequest, OtpRequest, RegisterRequest, UserRole, decodeJwt } from './auth.models';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly base = environment.apiBaseUrl || '';
  private readonly token$ = new BehaviorSubject<string | null>(this.getStoredToken());
  private readonly payload$ = new BehaviorSubject<JwtPayload | null>(decodeJwt(this.getStoredToken()));

  constructor(private http: HttpClient) {}

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, body);
  }

  verifyOtp(body: OtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/otp`, body);
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, body).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token$.next(null);
    this.payload$.next(null);
  }

  getToken(): string | null {
    return this.token$.value;
  }

  isLoggedIn(): boolean {
    return !!this.token$.value;
  }

  getUsername(): string | null {
    return this.payload$.value?.sub ?? null;
  }

  getRole(): UserRole | null {
    const role = this.payload$.value?.role;
    return role ? (role as UserRole) : null;
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this.getRole();
    return role ? roles.includes(role) : false;
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.token$.next(token);
    this.payload$.next(decodeJwt(token));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
