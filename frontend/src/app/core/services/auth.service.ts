import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import type { AuthUser, LoginRequest, LoginResponse, UserRole } from '../models/auth.model';
import { environment } from '../../../environments/environment';

const STORAGE_TOKEN_KEY = 'amp.auth.token';
const STORAGE_USER_KEY = 'amp.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly token = computed(() => this.tokenSignal());
  readonly currentUser = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal() && !!this.userSignal());

  initFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      const userRaw = localStorage.getItem(STORAGE_USER_KEY);
      const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;

      if (token && user?.id && user?.email && user?.role) {
        this.tokenSignal.set(token);
        this.userSignal.set(user);
      }
    } catch {
      // ignore storage errors
    }
  }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      map((res) => {
        this.persistAuth(res.token, res.user);
        return res;
      }),
      catchError((err) => throwError(() => this.normalizeLoginError(err))),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
  }

  getRole(): UserRole | null {
    return this.userSignal()?.role ?? null;
  }

  private persistAuth(token: string, user: AuthUser): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }

  private normalizeLoginError(err: unknown): Error {
    if (err instanceof HttpErrorResponse) {
      // Backend uses { success: false, message } for errors.
      const message =
        (typeof err.error?.message === 'string' && err.error.message) ||
        (typeof err.error === 'string' && err.error) ||
        (err.status === 0 ? `Unable to reach the API at ${environment.apiUrl}` : null) ||
        'Login failed';

      return new Error(message);
    }

    return err instanceof Error ? err : new Error('Login failed');
  }
}
