import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  xp_balance: number;
  weekly_xp_allowance: number;
  avatar_url: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'auth_token';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  
  // Using signals for reactive state
  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkAuthState();
  }

  /**
   * Check if user is logged in on app startup
   */
  private checkAuthState(): void {
    if (!this.isBrowser) return; // Skip on server
    
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    }
  }

  /**
   * Register a new user
   */
  register(name: string, email: string, password: string, passwordConfirmation: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    });
  }

  /**
   * Login user
   */
  login(email: string, password: string, rememberMe: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token, rememberMe);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/login']);
      })
    );
  }

  /**
   * Load user profile
   */
  loadUserProfile(): void {
    this.http.get<{ user: AuthUser }>(`${this.apiUrl}/profile`).subscribe({
      next: (response) => {
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.clearAuth();
      }
    });
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Save token to localStorage or sessionStorage
   */
  private setToken(token: string, rememberMe: boolean = false): void {
    if (!this.isBrowser) return;
    if (rememberMe) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.tokenKey);
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Update user's XP balance
   */
  updateXpBalance(newBalance: number): void {
    const user = this.currentUser();
    if (user) {
      this.currentUser.set({
        ...user,
        xp_balance: newBalance
      });
    }
  }
}
