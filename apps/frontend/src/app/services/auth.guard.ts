import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {

  constructor(private router: Router, private store: Store<{ auth: { isLoggedIn: boolean } }>) { }

  canLoad(): Observable<boolean> {
    return this.store.pipe(
      select('auth'),
      take(1),
      map((authState) => {
        if (authState.isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    )
  }
}
