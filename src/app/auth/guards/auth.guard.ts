import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { switchMap, catchError, take } from "rxjs/operators";
import * as fromModule from "../auth.reducers.index";
import { logout } from "../actions/auth.actions";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<fromModule.AuthState>) {}

  public canActivate(): Observable<boolean> {
    return this.userIsAuthorizedToNavigate();
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userIsAuthorizedToNavigate();
  }

  private userIsAuthorizedToNavigate(): Observable<boolean> {
    return this.userIsAuthorized().pipe(
      switchMap((authorized) => {
        if (!authorized) {
          this.logout();
        }
        return of(authorized);
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  private userIsAuthorized(): Observable<boolean> {
    return this.store.select(fromModule.getUserAuthorization).pipe(take(1));
  }

  private logout(): void {
    this.store.dispatch(logout());
  }
}
