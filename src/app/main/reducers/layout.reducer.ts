import { createReducer, on } from "@ngrx/store";
import { showLoading, hideLoading } from "../actions/loading.actions";

export interface LayoutState {
  loading: boolean;
}

export const initialState: LayoutState = {
  loading: false,
};

export const layoutReducer = createReducer(
  initialState,
  on(showLoading, (state) => ({ ...state, loading: true })),
  on(hideLoading, (state) => ({ ...state, loading: false }))
);

// Selectors
export const getLayoutState = (state: LayoutState) => state;
export const getLoadingData = (state: LayoutState) => state.loading;
