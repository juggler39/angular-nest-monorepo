import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from '../models/auth.model';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

interface AuthResponseData {
  iserId: string;
  accessToken: string;
  refreshToken: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  signup(user: AuthModel) {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/signup', user, { withCredentials: true });
  }

  login(user: AuthModel): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>('http://localhost:3000/api/auth/login', user, { withCredentials: true });
  }


  profile(): Observable<UserModel> {
    return this.http.get<UserModel>('http://localhost:3000/api/users/profile', {
      withCredentials: true,
    });
  }
}
