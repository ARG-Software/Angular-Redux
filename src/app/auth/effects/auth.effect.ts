import { APP_CONFIG } from "../../app.config";
import { UserModelUI } from "../models/auth.models";
import { Injectable, Inject, Injector } from "@angular/core";
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

  public loginUser$ = createEffect(() => {
    console.log("🚀 loginUser$ Effect INITIATED!");

    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      if (!this.actions$ || !this.actions$.pipe) {
        console.error(
          "🚨 actions$ is undefined or missing pipe function! Returning EMPTY."
        );
        return EMPTY;
      }

      return this.actions$.pipe(
        ofType(login),
        switchMap(({ username, password }) => {
          console.log("🔑 Received login action BEFORE API CALL:", username);
          const loginDto: MimsModels.ILoginDto = {
            UserName: username,
            Password: password,
          };

          return this.auth.login(loginDto).pipe(
            tap(() => console.log("🛜 API CALL STARTED for login...")),
            map((user: MimsModels.ILoginSession | null) => {
              if (!user) {
                console.warn("❌ Login failed, user not found.");
                return loginFailure();
              }

              console.log("🔑 Received user from API:", user);

              localStorage.setItem(this.accessTokenKey, user.AccessToken);
              localStorage.setItem(this.refreshTokenKey, user.RefreshToken);

              const newActionPayload: UserModelUI = {
                Id: user.User.Id,
                Name: user.User.Name,
                Email: user.User.Email,
                Login: user.User.Login,
              };

              console.log("✅ Dispatching loginSuccess:", newActionPayload);
              return loginSuccess({ user: newActionPayload });
            }),
            catchError((error) => {
              console.error("🔥 Login API Error:", error);
              return of(loginFailure());
            })
          );
        })
      );
    }) as any;
  });

  public loginSuccess$ = createEffect(
    () => {
      console.log("✅ loginSuccess$ Effect INITIATED!");

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        if (!this.actions$ || !this.actions$.pipe) {
          console.error(
            "🚨 actions$ is undefined or missing pipe function! Returning EMPTY."
          );
          return EMPTY;
        }

        return this.actions$.pipe(
          ofType(loginSuccess),
          tap(() => {
            console.log("🔀 Redirecting to /main after login success...");
            this.router.navigate(["main"]);
          })
        );
      }) as any;
    },
    { dispatch: false }
  );

  public loginFailure$ = createEffect(
    () => {
      console.log("❌ loginFailure$ Effect INITIATED!");

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        if (!this.actions$ || !this.actions$.pipe) {
          console.error(
            "🚨 actions$ is undefined or missing pipe function! Returning EMPTY."
          );
          return EMPTY;
        }

        return this.actions$.pipe(
          ofType(loginFailure),
          tap(() => {
            console.log("⚠️ Showing login failure message...");
          })
        );
      }) as any;
    },
    { dispatch: false }
  );

  public logout$ = createEffect(
    () => {
      console.log("🔓 logout$ Effect INITIATED!");

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        if (!this.actions$ || !this.actions$.pipe) {
          console.error(
            "🚨 actions$ is undefined or missing pipe function! Returning EMPTY."
          );
          return EMPTY;
        }

        return this.actions$.pipe(
          ofType(logout),
          tap(() => {
            console.log("🔓 Logging out...");
            localStorage.removeItem(this.accessTokenKey);
            localStorage.removeItem(this.refreshTokenKey);
            console.log("🔀 Redirecting to login page...");
            this.router.navigate([this.appConfigurations.loginAppPath]);
          })
        );
      }) as any;
    },
    { dispatch: false }
  );
}
