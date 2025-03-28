import { inject } from "@angular/core";
import { CanActivate, CanActivateChild, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromAuth from "../auth.reducers.index";

export class GuestGuard implements CanActivate, CanActivateChild {
  private store = inject(Store<fromAuth.AuthState>);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.isGuest();
  }

  canActivateChild(): Observable<boolean> {
    return this.isGuest();
  }

  private isGuest(): Observable<boolean> {
    return this.store.select(fromAuth.getUserAuthorization).pipe(
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(["/main"]);
          return false;
        }
        return true;
      })
    );
  }
}
