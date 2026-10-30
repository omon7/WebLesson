import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse, Credentials, JwtPayload } from '../models/auth';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private base = `${environment.apiUrl}/api/auth`;

  private token = signal<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );

  user = computed(() => decodePayload(this.token()));

  isLoggedIn = computed(() => {
    const u = this.user();
    return !!u && u.exp * 1000 > Date.now();
  });

  userId = computed(() =>
    this.user() ? Number(this.user()!.sub) : null
  );

  getToken(): string | null {
    return this.isLoggedIn() ? this.token() : null;
  }

  async login(credentials: Credentials): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.base}/login`,
        credentials
      )
    );

    this.save(response.token);
  }

  async register(credentials: Credentials): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.base}/register`,
        credentials
      )
    );

    this.save(response.token);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.router.navigate(['/']);
  }

  private save(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }
}

function decodePayload(token: string | null): JwtPayload | null {
  if (!token) return null;

  try {
    const part = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded = part.padEnd(
      part.length + (4 - part.length % 4) % 4,
      '='
    );

    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}