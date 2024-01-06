import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";


@Injectable()
class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

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
