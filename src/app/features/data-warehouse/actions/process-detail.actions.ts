import { createAction, props } from "@ngrx/store";
import { MachiningRequestModelUI } from "../models/downtime.models";

export const getProcessDetailData = createAction(
  "[Process Detail] Get process detail data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getProcessDetailDataSelectBoxes = createAction(
  "[Process Detail] Get process detail data for select boxes"
);

export const processDetailFailure = createAction(
  "[Process Detail] Process detail failed",
  props<{ payload: any }>()
);
