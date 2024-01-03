import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AppState, selectAuth } from "../store";

// token.interceptor.ts
@Injectable()
class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isLoggedIn$ = this.store.pipe(select(selectAuth));

    isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        console.log('is logged in');

        return next.handle(req);
      } else {
        console.log('not logged in');
        return next.handle(req);
        // const err = new Error('test')
        // return throwError(() => err);
      }
    })


    return next.handle(req);


    // // Attach access token to request headers
    // const authorizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getAccessToken()) });

    // return next.handle(authorizedReq).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401) {
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
