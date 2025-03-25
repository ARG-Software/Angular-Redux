import { UserModelUI } from "./../models/auth.models";
import { createAction, props } from "@ngrx/store";

export const login = createAction(
  "[Auth] Login",
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{ user: UserModelUI; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction("[Auth] Login Failure");

export const logout = createAction("[Auth] Logout");
