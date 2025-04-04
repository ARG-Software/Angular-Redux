import { createAction, props } from "@ngrx/store";
import {
  MachineStateDataRequestModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";

export const getMachineData = createAction(
  "[Machine] Get machine state data",
  props<{ payload: MachineStateDataRequestModelUI }>()
);

export const updateMachineData = createAction(
  "[Machine] Update machine state data",
  props<{ payload: MachineStateSaveDataModelUI }>()
);

export const machineFailure = createAction(
  "[Machine] Machine Failed",
  props<{ payload: any }>()
);
