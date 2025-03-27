import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from "@ngrx/store";
import {
  MachineState,
  machineStateReducer,
} from "./reducers/machine-state.reducer";
import { messagingReducer, MessagingState } from "./reducers/messasing.reducer";

export const reducerName = "production";

export interface ProductionState {
  machine: MachineState;
  messaging: MessagingState;
}

export const reducers: ActionReducerMap<ProductionState> = {
  machine: machineStateReducer,
  messaging: messagingReducer,
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
