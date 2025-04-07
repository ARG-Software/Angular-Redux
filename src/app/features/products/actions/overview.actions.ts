import { createAction, props } from "@ngrx/store";
import {
  DownTimeStatisticsChartRequestModel,
  MachineOperationsRequestModel,
} from "../models/overview.models";

export const getDownTimeChart = createAction(
  "[Overview] Get DownTime Chart",
  props<{ payload: DownTimeStatisticsChartRequestModel }>()
);

export const getMachineOperationTable = createAction(
  "[Overview] Get Machine Operation Table",
  props<{ payload: MachineOperationsRequestModel }>()
);

export const overviewFailure = createAction(
  "[Overview] Overview Failed",
  props<{ payload: any }>()
);
