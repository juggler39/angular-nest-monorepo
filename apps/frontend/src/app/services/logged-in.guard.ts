import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, take, map } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class LoggedInGuard implements CanActivate {

  constructor(private store: Store<{ auth: { isLoggedIn: boolean } }>) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select('auth'),
      take(1),
      map((authState) => !authState.isLoggedIn)
    )
  }
}
