import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface MachineStateLoadDataModelUI {
  Id: number;
  Name: string;
  Image: string;
  Options: MimsSelectBoxModel[];
}

export interface MachineStateSaveDataModelUI {
  Id: number;
  Option: MimsSelectBoxModel;
}

export interface MachineStateDataRequestModelUI {
  machineId: number;
}
