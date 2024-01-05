import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, map } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class LoggedInGuard {

  constructor(private router: Router, private store: Store<{ auth: { isLoggedIn: boolean } }>) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select('auth'),
      take(1),
      map((authState) => {
        if (authState.isLoggedIn) {
          this.router.navigate(['/restricted']);
          return false;
        } else {
          return true;
        }
      })
    )
  }
}
