import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  public isLoading = signal(false);
  public error: string | null = null;

  constructor(private auth: AuthService, private store: Store<AppState>) { this.isLoggedIn$ = this.store.pipe(select(selectAuth)); }


  public login() {
    this.isLoading = signal(true);
    const authFlow = this.auth
      .login(this.user)

    authFlow.subscribe({
      next: (user) => {
        console.log(user);
        this.isLoading.set(false);
        this.store.dispatch(login());
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error = error.error.message;
        console.log(error);
      },
    });
  }

  public logout() {
    this.store.dispatch(logout());
    console.log('logout');

  }

}
