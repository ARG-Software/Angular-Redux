import {
  MachineStateActionTypes,
  MachineActions,
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

export function reducer(
  state: MachineState = initialState,
  action: MachineActions
): MachineState {
  switch (action.type) {
    case MachineStateActionTypes.GetMachineDataSuccess: {
      return {
        ...state,
        machineData: action.payload,
      };
    }

    case MachineStateActionTypes.UpdateMachineData: {
      return {
        ...state,
        machineData: findAndUpdateMachine(state.machineData, action.payload),
      };
    }

    case MachineStateActionTypes.UpdateMachineDataSuccess: {
      return state;
    }

    default:
      return state;
  }
}

/**
 * Find machine in array and update information
 * @param stateMachines state of the machines
 * @param machine machine to be updated
 */
export function findAndUpdateMachine(
  stateMachines: MachineStateLoadDataModelUI[],
  machine: MachineStateSaveDataModelUI
): MachineStateLoadDataModelUI[] {
  const machines = Object.assign([], stateMachines) as any;
  machines[machines.indexOf(machine)] = machine;

  return machines;
}

/*
    Below are the selectors for this reducer. Make sure to make compact selectors as per
    requirements of your application.
*/

export const getMachineStateData = (state: MachineState) => state.machineData;
