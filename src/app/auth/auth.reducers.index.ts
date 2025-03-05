import * as fromAuthReducerDefinition from "./reducers/auth.reducers";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const reducerName = "auth";

export type AuthState = fromAuthReducerDefinition.AuthState;

export const reducers = fromAuthReducerDefinition.authReducer;

const selectAuthState =
  createFeatureSelector<fromAuthReducerDefinition.AuthState>(reducerName);

export const getUserAuthorization = createSelector(
  selectAuthState,
  (state) => state.authorized
);

export const hasLoginError = createSelector(
  selectAuthState,
  (state) => state.hasLoginError
);

export const getLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const getLoggedUser = createSelector(
  selectAuthState,
  (state) => state.loggedUser
);
