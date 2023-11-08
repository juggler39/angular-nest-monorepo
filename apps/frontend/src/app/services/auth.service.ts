import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from '../models/auth.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(user: AuthModel) {
    return this.http.post('http://localhost:3000/api/auth/login', user, { withCredentials: true });
  }

  userProfile: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({
    id: 0,
    name: '',
  });

  profile(): Observable<UserModel> {
    return this.http.get<UserModel>('http://localhost:3000/api/users/profile', {
      withCredentials: true,
    });
  }
}
