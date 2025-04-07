import { createAction, props } from "@ngrx/store";
import { MachiningRequestModelUI } from "../models/downtime.models";

export const getOeeData = createAction(
  "[OEE] Get Oee data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getOeeDataSelectBoxes = createAction(
  "[Oee] Get Oee data for select boxes"
);

export const oeeFailure = createAction(
  "[OEE] Oee Failed",
  props<{ payload: any }>()
);
