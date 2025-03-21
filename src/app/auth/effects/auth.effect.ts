import { APP_CONFIG } from "../../app.config";
import { UserModelUI } from "../models/auth.models";
import { Injectable, Injector, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { EMPTY, of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import * as MimsModels from "src/app/api/models/apimodels";
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
} from "../actions/auth.actions";
import { IAppConfig } from "../../app.config";
import { IAuthorizationService } from "src/app/api/services/interfaces/core/iauthorization.service";

@Injectable()
export class AuthEffects {
  private readonly appConfigurations: IAppConfig;
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;
  private actions$ = inject(Actions);

  constructor(
    private auth: IAuthorizationService,
    private router: Router,
    private readonly injector: Injector
  ) {
    this.appConfigurations = this.injector.get(APP_CONFIG);
    this.accessTokenKey = this.appConfigurations.accessTokenKey;
    this.refreshTokenKey = this.appConfigurations.refreshTokenKey;
  }

  public loginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      switchMap(({ username, password }) => {
        const loginDto: MimsModels.ILoginDto = {
          UserName: username,
          Password: password,
        };

        return this.auth.login(loginDto).pipe(
          map((user: MimsModels.ILoginSession | null) => {
            if (!user) {
              return loginFailure();
            }

            localStorage.setItem(this.accessTokenKey, user.AccessToken ?? "");
            localStorage.setItem(this.refreshTokenKey, user.RefreshToken ?? "");

            const newActionPayload: UserModelUI = {
              Id: user.User?.Id ?? 0,
              Name: user.User?.Name ?? "Unknown",
              Email: user.User?.Email ?? "Unknown",
              Login: user.User?.Login ?? "Unknown",
            };

            return loginSuccess({ user: newActionPayload });
          }),
          catchError((error) => {
            return of(loginFailure());
          })
        );
      })
    );
  });

  public loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.router.navigate(["main"]);
        })
      );
    },
    { dispatch: false }
  );

  public loginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(loginFailure));
    },
    { dispatch: false }
  );

  public logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem(this.accessTokenKey);
          localStorage.removeItem(this.refreshTokenKey);
          this.router.navigate([this.appConfigurations.loginAppPath]);
        })
      );
    },
    { dispatch: false }
  );
}
