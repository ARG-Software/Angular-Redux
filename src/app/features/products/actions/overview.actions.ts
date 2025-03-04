import { Action } from "@ngrx/store";
import {
  DownTimeStatisticsChartRequestModel,
  MachineOperationsRequestModel,
} from "../models/overview.models";
import {
  IMachineOperationsDto,
  IShiftGraphicDto,
} from "src/app/api/models/apimodels";

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum OverviewActionTypes {
  GetDownTimeChart = "[Overview] Get DownTime Chart",
  GetDownTimeChartSuccess = "[Overview] Get DownTime Chart Success",
  GetMachineOperationTable = "[Overview] Get Machine Operation Table",
  GetMachineOperationTableSuccess = "[Overview] Get Machine Operation Table Success",
  OverviewFailure = "[Overview] Overview Failed",
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class GetDownTimeChart implements Action {
  public type = OverviewActionTypes.GetDownTimeChart;

  constructor(public payload: DownTimeStatisticsChartRequestModel) {}
}

export class GetDownTimeChartSuccess implements Action {
  public type = OverviewActionTypes.GetDownTimeChartSuccess;

  constructor(public payload: IShiftGraphicDto[]) {}
}

export class GetMachineOperationTable implements Action {
  public type = OverviewActionTypes.GetMachineOperationTable;

  constructor(public payload: MachineOperationsRequestModel) {}
}

export class GetMachineOperationTableSuccess implements Action {
  public type = OverviewActionTypes.GetMachineOperationTableSuccess;

  constructor(public payload: IMachineOperationsDto[]) {}
}

export class OverviewFailure implements Action {
  public type = OverviewActionTypes.OverviewFailure;

  constructor(public payload: any) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type OverviewActions =
  | GetDownTimeChart
  | GetDownTimeChartSuccess
  | GetMachineOperationTable
  | GetMachineOperationTableSuccess
  | OverviewFailure;
