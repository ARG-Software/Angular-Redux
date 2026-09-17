import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { IAuthorizationService } from "../../api/services/interfaces/core/iauthorization.service";
import { APP_CONFIG } from "../../app.config";
import { login, loginFailure, loginSuccess, logout } from "../actions/auth.actions";
import { AuthService } from "../services/auth.service";
import { AuthEffects } from "./auth.effect";

describe("AuthEffects", () => {
  let actions$: Subject<Action>;
  let effects: AuthEffects;
  let authorization: jasmine.SpyObj<IAuthorizationService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    authorization = jasmine.createSpyObj<IAuthorizationService>(
      "IAuthorizationService",
      ["login"]
    );
    authService = jasmine.createSpyObj<AuthService>("AuthService", [
      "saveTokens",
      "clearTokens",
    ]);
    router = jasmine.createSpyObj<Router>("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: IAuthorizationService, useValue: authorization },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: APP_CONFIG,
          useValue: {
            loginAppPath: "login",
            accessTokenKey: "access",
            refreshTokenKey: "refresh",
          },
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it("maps a successful login response to loginSuccess", async () => {
    const session = {
      AccessToken: "access-token",
      RefreshToken: "refresh-token",
      User: {
        Id: 1,
        Name: "Test User",
        Email: "test@example.com",
        Login: "tester",
      },
    };
    authorization.login.and.returnValue(of(session));

    const resultPromise = firstValueFrom(effects.loginUser$);
    actions$.next(login({ username: "tester", password: "secret" }));

    expect(await resultPromise).toEqual(
      loginSuccess({
        user: session.User,
        accessToken: session.AccessToken,
        refreshToken: session.RefreshToken,
      })
    );
    expect(authorization.login).toHaveBeenCalledWith({
      UserName: "tester",
      Password: "secret",
    });
  });

  it("maps login errors to loginFailure", async () => {
    authorization.login.and.returnValue(
      throwError(() => new Error("authentication failed"))
    );

    const resultPromise = firstValueFrom(effects.loginUser$);
    actions$.next(login({ username: "tester", password: "bad" }));

    expect(await resultPromise).toEqual(loginFailure());
  });

  it("saves tokens and navigates after login succeeds", async () => {
    const action = loginSuccess({
      user: {
        Id: 1,
        Name: "Test User",
        Email: "test@example.com",
        Login: "tester",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    const resultPromise = firstValueFrom(effects.loginSuccess$);

    actions$.next(action);
    await resultPromise;

    expect(authService.saveTokens).toHaveBeenCalledWith(
      "access-token",
      "refresh-token"
    );
    expect(router.navigate).toHaveBeenCalledWith(["main"]);
  });

  it("clears tokens and navigates to login on logout", async () => {
    const resultPromise = firstValueFrom(effects.logout$);

    actions$.next(logout());
    await resultPromise;

    expect(authService.clearTokens).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["login"]);
  });
});
