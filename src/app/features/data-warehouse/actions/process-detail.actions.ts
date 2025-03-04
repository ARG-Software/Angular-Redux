import { Action } from "@ngrx/store";
import { ProcessDetailDataModelUI } from "../models/process-detail.models";
import { MachiningRequestModelUI } from "../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export enum ProcessDetailActionTypes {
  GetProcessDetailDataSelectBoxes = "[Process Detail] Get process detail data for select boxes",
  GetProcessDetailDataSelectBoxesSuccess = "[Process Detail] Get process detail data for select boxes Success",

  GetProcessDetailData = "[Process Detail] Get process detail data",
  GetProcessDetailDataSuccess = "[Process Detail] Get process detail data success",

  ProcessDetailFailure = "[Process Detail] Process detail failed",
}

export class GetProcessDetailDataSelectBoxes implements Action {
  public type = ProcessDetailActionTypes.GetProcessDetailDataSelectBoxes;

  constructor(public payload?: any) {}
}

export class GetProcessDetailDataSelectBoxesSuccess implements Action {
  public type = ProcessDetailActionTypes.GetProcessDetailDataSelectBoxesSuccess;

  constructor(public payload: MimsSelectBoxModel[]) {}
}

export class GetProcessDetailData implements Action {
  public type = ProcessDetailActionTypes.GetProcessDetailData;

  constructor(public payload: MachiningRequestModelUI) {}
}

export class GetProcessDetailDataSuccess implements Action {
  public type = ProcessDetailActionTypes.GetProcessDetailDataSuccess;

  constructor(public payload: ProcessDetailDataModelUI) {}
}

export class ProcessDetailFailure implements Action {
  public type = ProcessDetailActionTypes.ProcessDetailFailure;

  constructor(public payload: any) {}
}

export type ProcessDetailActions =
  | GetProcessDetailDataSelectBoxes
  | GetProcessDetailDataSelectBoxesSuccess
  | GetProcessDetailData
  | GetProcessDetailDataSuccess
  | ProcessDetailFailure;
