import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";

type MachineState = {
  machineData: MachineStateLoadDataModelUI[];
};

export const MachineStateStore = signalStore(
  withState<MachineState>({
    machineData: [],
  }),

  withMethods((store) => ({
    setMachineData(data: MachineStateLoadDataModelUI[]) {
      patchState(store, { machineData: data });
    },

    updateMachine(update: MachineStateSaveDataModelUI) {
      patchState(store, (state) => ({
        machineData: state.machineData.map((m) =>
          m.Id === update.Id ? { ...m, Option: update.Option } : m
        ),
      }));
    },
  }))
);
