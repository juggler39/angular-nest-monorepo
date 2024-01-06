import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, map, catchError, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })

export class LoggedInGuard {

  constructor(private router: Router, private auth: AuthService, private store: Store<{ auth: { isLoggedIn: boolean } }>) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select('auth'),
      take(1),
      switchMap((authState) => {
        if (authState.isLoggedIn) {
          this.router.navigate(['/restricted']);
          return of(false);
        } else {
          return this.auth.check().pipe(
            map(response => {
              if (response.data) { this.router.navigate(['/restricted']) };
              return false
            }),
            catchError(() => {
              return of(true)
            }),
          )
        }
      }),
    )
  }
}
