import { createReducer, on } from "@ngrx/store";
import { UserModelUI } from "../models/auth.models";
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
} from "../actions/auth.actions";

export interface AuthState {
  authorized: boolean;
  loggedUser: UserModelUI | null;
  loading: boolean;
  hasLoginError: boolean;
}

export const initialState: AuthState = {
  authorized: false,
  loggedUser: null,
  loading: false,
  hasLoginError: false,
};

export const authReducer = createReducer(
  initialState,

  /** 🔑 Login starts */
  on(login, (state) => ({
    ...state,
    loading: true,
    hasLoginError: false,
  })),

  on(loginFailure, (state) => ({
    ...state,
    hasLoginError: true,
    loading: false,
  })),

  on(loginSuccess, (state, { user }) => ({
    ...state,
    authorized: true,
    loggedUser: user,
    loading: false,
    hasLoginError: false,
  })),

  on(logout, () => initialState)
);

export const getAuthState = (state: AuthState) => state;
export const getUserAuthorization = (state: AuthState) => state.authorized;
export const hasLoginError = (state: AuthState) => state.hasLoginError;
export const getLoading = (state: AuthState) => state.loading;
export const getLoggedUser = (state: AuthState) => state.loggedUser;
