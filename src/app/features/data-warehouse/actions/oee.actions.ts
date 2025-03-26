import { Action } from "@ngrx/store";
import { OeeDataModelUI } from "../models/oee.models";
import { MachiningRequestModelUI } from "../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export enum OeeActionTypes {
  GetOeeDataSelectBoxes = "[Oee] Get Oee data for select boxes",
  GetOeeDataSelectBoxesSuccess = "[Oee] Get Oee data for select boxes Success",

  GetOeeData = "[OEE] Get Oee data",
  GetOeeDataSuccess = "[OEE] Get Oee data Success",

  OeeFailure = "[OEE] Oee Failed",
}

export class GetOeeDataSelectBoxes implements Action {
  public type = OeeActionTypes.GetOeeDataSelectBoxes;

  constructor(public payload?: any) {}
}

export class GetOeeDataSelectBoxesSuccess implements Action {
  public type = OeeActionTypes.GetOeeDataSelectBoxesSuccess;

  constructor(public payload: [MimsSelectBoxModel[], MimsSelectBoxModel[]]) {}
}

export class GetOeeData implements Action {
  public type = OeeActionTypes.GetOeeData;

  constructor(public payload: MachiningRequestModelUI) {}
}

export class GetOeeDataSuccess implements Action {
  public type = OeeActionTypes.GetOeeDataSuccess;

  constructor(public payload: OeeDataModelUI) {}
}

export class OeeFailure implements Action {
  public type = OeeActionTypes.OeeFailure;

  constructor(public payload: any) {}
}

export type OeeActions =
  | GetOeeDataSelectBoxes
  | GetOeeDataSelectBoxesSuccess
  | GetOeeData
  | GetOeeDataSuccess
  | OeeFailure;
