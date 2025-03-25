import { APP_CONFIG } from "../../app.config";
import { UserModelUI } from "../models/auth.models";
import { Injectable, Injector, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
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
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthEffects {
  private readonly appConfigurations: IAppConfig;
  private readonly authService = inject(AuthService);
  private actions$ = inject(Actions);

  constructor(
    private auth: IAuthorizationService,
    private router: Router,
    private readonly injector: Injector
  ) {
    this.appConfigurations = this.injector.get(APP_CONFIG);
  }

  public loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ username, password }) => {
        const loginDto: MimsModels.ILoginDto = {
          UserName: username,
          Password: password,
        };

        return this.auth.login(loginDto).pipe(
          map((user: MimsModels.ILoginSession) => {
            const userPayload: UserModelUI = {
              Id: user.User.Id,
              Name: user.User.Name,
              Email: user.User.Email,
              Login: user.User.Login,
            };

            return loginSuccess({
              user: userPayload,
              accessToken: user.AccessToken,
              refreshToken: user.RefreshToken,
            });
          }),
          catchError(() => of(loginFailure()))
        );
      })
    )
  );

  public loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ accessToken, refreshToken }) => {
          this.authService.saveTokens(accessToken, refreshToken);
          this.router.navigate(["main"]);
        })
      ),
    { dispatch: false }
  );

  public loginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(loginFailure));
    },
    { dispatch: false }
  );

  public logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearTokens();
          this.router.navigate([this.appConfigurations.loginAppPath]);
        })
      ),
    { dispatch: false }
  );
}
