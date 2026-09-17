import { login, loginFailure, loginSuccess, logout } from "../actions/auth.actions";
import { authReducer, initialState } from "./auth.reducers";

describe("Auth Reducer", () => {
  const user = {
    Id: 1,
    Name: "Test User",
    Email: "test@example.com",
    Login: "tester",
  };

  it("returns the initial state for an unknown action", () => {
    expect(authReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("sets loading while login is in progress", () => {
    expect(
      authReducer(initialState, login({ username: "tester", password: "secret" }))
    ).toEqual({ ...initialState, loading: true });
  });

  it("stores the authenticated user after a successful login", () => {
    expect(
      authReducer(
        { ...initialState, loading: true, hasLoginError: true },
        loginSuccess({ user, accessToken: "access", refreshToken: "refresh" })
      )
    ).toEqual({
      ...initialState,
      authorized: true,
      loggedUser: user,
    });
  });

  it("records a failed login and stops loading", () => {
    expect(
      authReducer({ ...initialState, loading: true }, loginFailure())
    ).toEqual({ ...initialState, hasLoginError: true });
  });

  it("resets authentication state on logout", () => {
    const authenticatedState = {
      ...initialState,
      authorized: true,
      loggedUser: user,
    };

    expect(authReducer(authenticatedState, logout())).toEqual(initialState);
  });
});
