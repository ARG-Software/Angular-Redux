import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from "@ngrx/store";
import { messagingReducer, MessagingState } from "./reducers/messasing.reducer";

export const reducerName = "production";

export interface ProductionState {
  messaging: MessagingState;
}

export const reducers: ActionReducerMap<ProductionState> = {
  messaging: messagingReducer,
};

const getProductionState = createFeatureSelector<ProductionState>(reducerName);

const getMessagingState = createSelector(
  getProductionState,
  (state) => state.messaging
);

export const getMessagingData = createSelector(
  getMessagingState,
  (state) => state.messagingData
);

export const getMessagingToSave = createSelector(
  getMessagingState,
  (state) => state.messagingToSave
);
