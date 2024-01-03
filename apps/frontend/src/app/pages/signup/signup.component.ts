import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { Store, select } from '@ngrx/store';
import { login } from '../../store/actions/auth.actions';
import { AppState, selectAuth } from '../../store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {

  user: AuthModel = {
    username: '',
    password: '',
  };

  public isLoggedIn$: Observable<boolean>;
  public isLoading = false;

  constructor(private auth: AuthService, private store: Store<AppState>) { this.isLoggedIn$ = this.store.pipe(select(selectAuth)); }


  public signup() {
    this.isLoading = true;
    this.auth.signup(this.user).pipe(
      catchError(err => {
        this.isLoading = false;
        console.log('Handling error locally and rethrowing it...', err);
        const message = new Error(err.error.message);
        return throwError(() => message);
      })
    ).subscribe(

      data => {
        console.log(data);
        this.isLoading = false;
        this.store.dispatch(login());
      }
    );
  }


}
