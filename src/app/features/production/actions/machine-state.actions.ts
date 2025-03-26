import { createAction, props } from "@ngrx/store";
import {
  MachineStateDataRequestModelUI,
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";

export const getMachineData = createAction(
  "[Machine] Get machine state data",
  props<{ payload: MachineStateDataRequestModelUI }>()
);

export const getMachineDataSuccess = createAction(
  "[Machine] Get machine state data success",
  props<{ payload: MachineStateLoadDataModelUI[] }>()
);

export const updateMachineData = createAction(
  "[Machine] Update machine state data",
  props<{ payload: MachineStateSaveDataModelUI }>()
);

export const updateMachineDataSuccess = createAction(
  "[Machine] Update machine state data success",
  props<{ payload: boolean }>()
);

export const machineFailure = createAction(
  "[Machine] Machine Failed",
  props<{ payload: any }>()
);
