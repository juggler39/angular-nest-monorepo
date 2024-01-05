import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel, AuthResponseData } from '../models/auth.model';
import { Observable, map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/index';
import { login } from '@store/actions/auth.actions';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private store: Store<AppState>) { }

  private accessToken = '';

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  refreshToken(): Observable<string> {
    return this.http.get<{ accessToken: string }>('http://localhost:3000/api/auth/refresh', {
      headers: { 'header1': 'value1', 'header2': 'value2' }
    }).pipe(
      tap((response) => { this.setAccessToken(response.accessToken); }),
      map(response => response.accessToken)
    );
  }

  signup(user: AuthModel) {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/signup', user, { withCredentials: true }).pipe(
      map((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.setAccessToken(response.accessToken);
        this.store.dispatch(login());
        return response;
      })
    );;
  }

  login(user: AuthModel): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/login', user, { withCredentials: true }).pipe(
      map((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.setAccessToken(response.accessToken);
        this.store.dispatch(login());
        return response;
      })
    );
  }

}
