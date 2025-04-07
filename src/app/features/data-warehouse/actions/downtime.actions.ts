import { createAction, props } from "@ngrx/store";
import { MachiningRequestModelUI } from "../models/downtime.models";

export const getDowntimeData = createAction(
  "[Downtime] Get Downtime data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getDowntimeDataSelectBoxes = createAction(
  "[Downtime] Get Downtime data for select boxes"
);

export const downtimeFailure = createAction(
  "[Downtime] Downtime Failed",
  props<{ payload: any }>()
);
