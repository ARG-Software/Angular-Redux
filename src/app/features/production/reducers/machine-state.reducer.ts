import { createReducer, on } from "@ngrx/store";
import {
  getMachineDataSuccess,
  updateMachineData,
  updateMachineDataSuccess,
} from "../actions/machine-state.actions";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";

export interface MachineState {
  machineData: MachineStateLoadDataModelUI[];
}

export const initialState: MachineState = {
  machineData: [],
};

export const machineStateReducer = createReducer(
  initialState,

  on(getMachineDataSuccess, (state, { payload }) => ({
    ...state,
    machineData: [...payload],
  })),

  on(updateMachineData, (state, { payload }) => ({
    ...state,
    machineData: findAndUpdateMachine(state.machineData, payload),
  })),

  on(updateMachineDataSuccess, (state) => ({
    ...state,
  }))
);

// Helper for updating machine data
function findAndUpdateMachine(
  stateMachines: MachineStateLoadDataModelUI[],
  machine: MachineStateSaveDataModelUI
): MachineStateLoadDataModelUI[] {
  const machines = [...stateMachines];
  const index = machines.findIndex((m) => m.Id === machine.Id);
  if (index !== -1) {
    machines[index] = { ...machines[index], ...machine };
  }
  return machines;
}

// Selector
export const getMachineStateData = (state: MachineState) => state.machineData;
