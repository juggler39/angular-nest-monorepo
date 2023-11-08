import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { Observable, switchMap } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { Store, select } from '@ngrx/store';
import { login, logout } from '../../store/actions/auth.actions';
import { AppState, selectAuth } from '../../store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  user: AuthModel = {
    username: '',
    password: '',
  };

  public isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService, private store: Store<AppState>) { this.isLoggedIn$ = this.store.pipe(select(selectAuth)); }


  public login() {
    const authFlow = this.auth
      .login(this.user)
      .pipe(switchMap(() => this.auth.profile()));

    authFlow.subscribe({
      next: (user: UserModel) => {
        console.log(user);
        this.store.dispatch(login());
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public logout() {
    this.store.dispatch(logout());
    console.log('logout');

  }

}
