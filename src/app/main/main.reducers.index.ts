import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from "@ngrx/store";
import {
  LayoutState,
  getLoadingData,
  layoutReducer,
} from "./reducers/layout.reducer";

export const reducerName = "mains";

export interface MainState {
  layout: LayoutState;
}

export const mainReducers: ActionReducerMap<MainState> = {
  layout: layoutReducer,
};

const getModuleState = createFeatureSelector<MainState>(reducerName);

const getLoadingState = createSelector(getModuleState, (state) => state.layout);

export const getLoading = createSelector(getLoadingState, getLoadingData);
