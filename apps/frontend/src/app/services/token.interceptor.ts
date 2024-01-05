import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";

// token.interceptor.ts
@Injectable()
class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    console.log('sadfsd');

    // Attach access token to request headers
    const authorizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getAccessToken()) });

    return next.handle(req)
    // .pipe(
    //   catchError((error) => {
    //     if (error.status === 401 || error.status === 403) {
    //       // Access token is expired, try refreshing
    //       return this.authService.refreshToken().pipe(
    //         switchMap((newToken: string) => {
    //           // Set the new token in authService for in-memory storage
    //           this.authService.setAccessToken(newToken);

    //           // Use the new token for the retry
    //           const retriedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + newToken) });
    //           return next.handle(retriedReq);
    //         })
    //       );
    //     }
    //     return throwError(error);
    //   })
    // );
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
