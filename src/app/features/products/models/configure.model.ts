import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface ProductModelUI {
  Id: number;
  Name?: string;
  TargetHoursPerWeek: number;
  TargetEfficiency: number;
}

export interface OperationModelUI {
  Id: number;
  ProductId: number | undefined;
  Number: number;
  Description: string;
  Subcontractor: SubcontractorModelUI;
}

export interface SubcontractorModelUI {
  Id: number;
  Name: string;
}

export interface MachineOperationModelUI {
  Id: number;
  ProductId: number | undefined;
  MachineId: number;
  MachineName?: string;
  OperationId: number;
  OperationName?: string;
  OEE: number;
  MDE: number;
}

export interface MachineModelUI {
  Id: number;
  Name: string;
}

export interface MoteModelUI {
  Id: number;
  ProductId: number | undefined;
  Name: string;
  MachineId: number;
  MachineName?: string;
  EdgeId: number;
  EdgeName?: string;
  PollInterval: number;
}

export interface EdgeModelUI {
  Id: number;
  Model: string;
}

export interface MessageModelUI {
  Id: number;
  Name: string;
}

export interface SensorModelUI {
  Id: number;
  ProductId: number | undefined;
  ContactMessageId: number;
  ContactMessageName?: string;
  MoteId: number;
  MoteName?: string;
  MachineInputTerminal: string;
  MachineMCode: string;
  LineOut: string;
}

export interface ResumeConfigurationModelUI {
  addedOperations: OperationModelUI[];
  removedOperations: OperationModelUI[];
  addedMachines: MachineOperationModelUI[];
  removedMachines: MachineOperationModelUI[];
  addedMotes: MoteModelUI[];
  removedMotes: MoteModelUI[];
  addedSensors: SensorModelUI[];
  removedSensors: SensorModelUI[];
}

export interface GetOperationsSuccessReducerModel {
  operationList: OperationModelUI[];
  operationSelectBox: ConfigureSelectBoxModelUI[];
}

export interface ConfigureSelectBoxModelUI extends MimsSelectBoxModel {}
