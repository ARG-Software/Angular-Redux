import { createAction, props } from "@ngrx/store";
import { OeeDataModelUI } from "../models/oee.models";
import { MachiningRequestModelUI } from "../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export const getOeeData = createAction(
  "[OEE] Get Oee data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getOeeDataSuccess = createAction(
  "[OEE] Get Oee data Success",
  props<{ payload: OeeDataModelUI }>()
);

export const getOeeDataSelectBoxes = createAction(
  "[Oee] Get Oee data for select boxes",
  props<{ payload?: any }>()
);

export const getOeeDataSelectBoxesSuccess = createAction(
  "[Oee] Get Oee data for select boxes Success",
  props<{ payload: [MimsSelectBoxModel[], MimsSelectBoxModel[]] }>()
);

export const oeeFailure = createAction(
  "[OEE] Oee Failed",
  props<{ payload: any }>()
);
