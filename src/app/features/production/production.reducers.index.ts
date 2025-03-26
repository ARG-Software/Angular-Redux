import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from "@ngrx/store";
import * as fromMessagingReducer from "./reducers/messasing.reducer";
import {
  MachineState,
  machineStateReducer,
} from "./reducers/machine-state.reducer";

export const reducerName = "production";

export interface ProductionState {
  machine: MachineState;
  messaging: fromMessagingReducer.MessagingState;
}

export const reducers: ActionReducerMap<ProductionState> = {
  machine: machineStateReducer,
  messaging: fromMessagingReducer.reducer as any,
};

const getProductionState = createFeatureSelector<ProductionState>(reducerName);

const getMachineState = createSelector(
  getProductionState,
  (state) => state.machine
);

export const getMachineData = createSelector(
  getMachineState,
  (state) => state.machineData
);

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
