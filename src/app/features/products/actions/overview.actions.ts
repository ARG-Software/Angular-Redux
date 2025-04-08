import { createAction, props } from "@ngrx/store";
import {
  DownTimeStatisticsChartRequestModel,
  MachineOperationsRequestModel,
} from "../models/overview.models";
import {
  IShiftGraphicDto,
  IMachineOperationsDto,
} from "src/app/api/models/apimodels";

export const getDownTimeChart = createAction(
  "[Overview] Get DownTime Chart",
  props<{ payload: DownTimeStatisticsChartRequestModel }>()
);

export const getDownTimeChartSuccess = createAction(
  "[Overview] Get DownTime Chart Success",
  props<{ payload: IShiftGraphicDto[] }>()
);

export const getMachineOperationTable = createAction(
  "[Overview] Get Machine Operation Table",
  props<{ payload: MachineOperationsRequestModel }>()
);

export const getMachineOperationTableSuccess = createAction(
  "[Overview] Get Machine Operation Table Success",
  props<{ payload: IMachineOperationsDto[] }>()
);

export const overviewFailure = createAction(
  "[Overview] Overview Failed",
  props<{ payload: any }>()
);
