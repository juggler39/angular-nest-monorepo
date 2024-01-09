import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { logout } from "@store/actions/auth.actions";
import { AppState } from "@store/index";
import { LocalStorageService } from "./localstorage.service";


@Injectable()
class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private localStorage: LocalStorageService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req)
      .pipe(catchError((error) => {

        if (error instanceof HttpErrorResponse && !req.url.includes('auth/refresh') && error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              return next.handle(req);
            }),
            catchError((error) => { return throwError(() => new Error(error)); })
          );
        } else {
          this.store.dispatch(logout());
          this.localStorage.removeItem('user');
        }
        this.router.navigate(['/'])
        return EMPTY
      })
      );
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
