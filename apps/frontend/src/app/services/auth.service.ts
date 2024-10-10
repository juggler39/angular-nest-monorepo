import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthModel, AuthResponseData } from '../models/auth.model';
import { EMPTY, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/index';
import { login, logout } from '@store/actions/auth.actions';
import { Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private localStorage: LocalStorageService) { }

  refreshToken(): Observable<string> {
    const user = JSON.parse(this.localStorage.getItem('user'));
    const refreshToken = user?.refreshToken ? user.refreshToken : null;

    if (refreshToken) {
      const headers = new HttpHeaders().append('Authorization', 'Bearer ' + refreshToken)
      return this.http.get<{ refreshToken: string }>('http://localhost:3000/api/auth/refresh', { headers: headers, withCredentials: true }).pipe(
        tap((response) => {
          user.refreshToken = response.refreshToken;
          this.localStorage.setItem('user', JSON.stringify(response));
          this.store.dispatch(login());
        }),
        map(response => response.refreshToken),
        catchError(() => { return throwError(() => new Error('error')); }),
      );
    } else {
      return EMPTY
    }
  }

  signup(user: AuthModel) {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/signup', user, { withCredentials: true }).pipe(
      map((response) => {
        this.localStorage.setItem('user', JSON.stringify(response));
        this.store.dispatch(login());
        return response;
      })
    );
  }

  login(user: AuthModel): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/login', user, { withCredentials: true }).pipe(
      map((response) => {
        this.localStorage.setItem('user', JSON.stringify(response));
        this.store.dispatch(login());
        return response;
      })
    );
  }

  logout(): Observable<void> {
    return this.http.get<AuthResponseData>('http://localhost:3000/api/auth/logout', { withCredentials: true }).pipe(
      map(() => {
        this.localStorage.removeItem('user');
        this.store.dispatch(logout());
        this.router.navigate(['/login'])
      })
    );
  }

  check(): Observable<{ data: string }> {
    return this.http.get<{ data: string }>('http://localhost:3000/api/auth/check', { withCredentials: true }).pipe(
      catchError(() => { return throwError(() => new Error('error')); }),
      tap(() => {
        this.store.dispatch(login());
      }),
    );
  }

}
