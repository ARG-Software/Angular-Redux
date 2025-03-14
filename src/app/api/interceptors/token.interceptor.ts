import { Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
} from "@angular/common/http";
import { ApiAuthService } from "../services/api-auth.service";
import { Observable, Subject, EMPTY, throwError } from "rxjs";
import { switchMap, catchError, tap } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private tokenRefreshedSource = new Subject<void>();
  private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
  private apiAuth!: ApiAuthService;

  constructor(private injector: Injector) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.apiAuth = this.injector.get(ApiAuthService);
    request = this.apiAuth.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError((error) => {
        switch (error.status) {
          case 401:
            return this.refreshToken().pipe(
              switchMap((token: string) => {
                this.apiAuth.updateAccessToken(token);
                request = this.apiAuth.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError(() => {
                this.apiAuth.logout();
                return EMPTY;
              })
            );
        }

        return throwError(() => error);
      })
    );
  }

  private refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable((observer) => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next(null);
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.apiAuth.getNewAccessToken().pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next();
        })
      );
    }
  }
}
