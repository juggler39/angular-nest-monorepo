import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(private router: Router, private auth: AuthService, private store: Store<{ auth: { isLoggedIn: boolean } }>) { }

  canActivate(): Observable<boolean> {

    return this.store.pipe(
      select('auth'),
      take(1),
      switchMap((authState) => {
        if (authState.isLoggedIn) {
          return of(true);
        } else {
          return this.auth.check().pipe(
            map(response => !!response.data),
            catchError(() => {
              this.router.navigate(['/login']);
              return of(false)
            }),
          )
        }
      }),
    )
  }
}
