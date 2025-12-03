import { Injectable, inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSignal: WritableSignal<User | null> = signal(this.getUserFromStorage());
  
  // Signal de solo lectura para uso externo
  public currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();
  
  // Computed signal para verificar si está autenticado
  public isAuthenticatedSignal: Signal<boolean> = computed(() => !!this.currentUserSignal());
  
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor() {}

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUserValue(): User | null {
    return this.currentUserSignal();
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setToken(response.data.token);
          this.setUser(response.data.user);
          this.currentUserSignal.set(response.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  updateProfile(data: { name?: string; email?: string }): Promise<any> {
    return this.http.put<ApiResponse<User>>(
      `${environment.apiUrl}/auth/update-profile`,
      data
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setUser(response.data);
          this.currentUserSignal.set(response.data);
        }
      })
    ).toPromise();
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Promise<any> {
    return this.http.post<ApiResponse<boolean>>(
      `${environment.apiUrl}/auth/change-password`,
      data
    ).toPromise();
  }
}
