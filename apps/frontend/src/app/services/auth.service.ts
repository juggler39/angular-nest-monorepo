import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from '../models/auth.model';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/index';
import { login } from '@store/actions/auth.actions';

interface AuthResponseData {
  iserId: string;
  accessToken: string;
  refreshToken: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private store: Store<AppState>) { }

  signup(user: AuthModel) {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/signup', user, { withCredentials: true });
  }

  login(user: AuthModel): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/login', user, { withCredentials: true }).pipe(
      map((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.store.dispatch(login());
        return response;
      })
    );
  }

}
