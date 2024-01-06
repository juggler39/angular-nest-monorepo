import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthModel } from '@models/auth.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState, selectAuth } from '@store/index';

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

  constructor(private auth: AuthService, private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.pipe(select(selectAuth));
  }


  public login() {
    this.isLoading = signal(true);
    this.auth.login(this.user).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error = error.error.message;
        console.log(error);
      },
    });
  }

  public logout() {
    this.auth.logout().subscribe()
  }

}
