import { APP_CONFIG } from "../../app.config";
import { UserModelUI } from "../models/auth.models";
import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import * as MimsModels from "src/app/api/models/apimodels";
import {
  AuthActionTypes,
  Login,
  LoginFailure,
  LoginSuccess,
} from "../actions/auth.actions";
import { IAppConfig } from "../../app.config";
import { IAuthorizationService } from "src/app/api/services/interfaces/core/iauthorization.service";

@Injectable()
export class AuthEffects {
  private readonly appConfigurations: IAppConfig;
  private accessTokenKey: string;
  private refreshTokenKey: string;

  constructor(
    private actions$: Actions,
    private auth: IAuthorizationService,
    private router: Router,
    private readonly injector: Injector
  ) {
    this.appConfigurations = this.injector.get(APP_CONFIG);
    this.accessTokenKey = this.appConfigurations.accessTokenKey;
    this.refreshTokenKey = this.appConfigurations.refreshTokenKey;
  }

  public loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType<Login>(AuthActionTypes.Login),
      switchMap(({ payload }: Login) => {
        const loginDto: MimsModels.ILoginDto = {
          UserName: payload.username,
          Password: payload.password,
        };

        return this.auth.login(loginDto).pipe(
          map((user: MimsModels.ILoginSession | null) => {
            if (!user) {
              return new LoginFailure({});
            }

            localStorage.setItem(this.accessTokenKey, user.AccessToken);
            localStorage.setItem(this.refreshTokenKey, user.RefreshToken);

            const newActionPayload: UserModelUI = {
              Id: user.User.Id,
              Name: user.User.Name,
              Email: user.User.Email,
              Login: user.User.Login,
            };

            return new LoginSuccess(newActionPayload);
          }),
          catchError((error) => {
            console.error("Login Error:", error);
            return of(new LoginFailure({}));
          })
        );
      })
    )
  );

  public loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginSuccess),
        tap(() => {
          this.router.navigate(["main"]);
        })
      ),
    { dispatch: false }
  );

  public loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginFailure),
        tap(() => {
          console.log("Login Failed");
        })
      ),
    { dispatch: false }
  );

  public logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.Logout),
        tap(() => {
          localStorage.removeItem(this.accessTokenKey);
          localStorage.removeItem(this.refreshTokenKey);
          this.router.navigate([this.appConfigurations.loginAppPath]);
        })
      ),
    { dispatch: false }
  );
}
