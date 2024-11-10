import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthModel, AuthResponseData } from '../models/auth.model';
import { EMPTY, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/index';
import { login, logout } from '@store/auth/auth.actions';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';
import { environment } from '../../environments/environments';
const API_PATH = environment.apiPath
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private deviceId: string;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.deviceId = this.getOrCreateDeviceId();
  }

  private getOrCreateDeviceId(): string {
    let deviceId = this.localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      this.localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private generateDeviceId(): string {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    );
  }

  refreshToken(): Observable<string> {
    const user = JSON.parse(this.localStorage.getItem('user'));
    const refreshToken = user?.refreshToken ? user.refreshToken : null;

    if (refreshToken) {
      const headers = new HttpHeaders().append('Authorization', 'Bearer ' + refreshToken)
      return this.http.post<{ refreshToken: string }>(`${API_PATH}/auth/refresh`, { refreshToken,
        deviceId: this.deviceId}, {headers, withCredentials: true }).pipe(
        tap((response) => {
          user.refreshToken = response.refreshToken;
          this.localStorage.setItem('user', JSON.stringify(response));
          this.store.dispatch(login());
        }),
        map(response => response.refreshToken),
        catchError(() => { return throwError(() => new Error('error')); }),
      );
    } else {
      return EMPTY;
    }
  }

  signup(user: AuthModel) {
    return this.http.post<AuthResponseData>(
      `${API_PATH}/auth/signup`,
      { ...user, deviceId: this.deviceId },
      { withCredentials: true }
    ).pipe(
      map((response) => {
        this.localStorage.setItem('user', JSON.stringify(response));
        this.store.dispatch(login());
        return response;
      })
    );
  }

  login(user: AuthModel): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `${API_PATH}/auth/login`,
      { ...user, deviceId: this.deviceId },
      { withCredentials: true }
    ).pipe(
      map((response) => {
        this.localStorage.setItem('user', JSON.stringify(response));
        this.store.dispatch(login());
        return response;
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<{ data: string }>(
      `${API_PATH}/auth/logout`,
      {
        deviceId: this.deviceId,
      },
      { withCredentials: true }
    ).pipe(
      map(() => {
        this.localStorage.removeItem('user');
        this.store.dispatch(logout());
        this.router.navigate(['/login']);
      })
    );
  }

  check(): Observable<{ data: string }> {
    return this.http.get<{ data: string }>(
      `${API_PATH}/auth/check`,
      { withCredentials: true }
    ).pipe(
      catchError(() => { return throwError(() => new Error('error')); }),
      tap(() => {
        this.store.dispatch(login());
      }),
    );
  }
}
