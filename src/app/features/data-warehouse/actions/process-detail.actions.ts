import { createAction, props } from "@ngrx/store";
import { ProcessDetailDataModelUI } from "../models/process-detail.models";
import { MachiningRequestModelUI } from "../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export const getProcessDetailData = createAction(
  "[Process Detail] Get process detail data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getProcessDetailDataSuccess = createAction(
  "[Process Detail] Get process detail data success",
  props<{ payload: ProcessDetailDataModelUI }>()
);

export const getProcessDetailDataSelectBoxes = createAction(
  "[Process Detail] Get process detail data for select boxes",
  props<{ payload?: any }>()
);

export const getProcessDetailDataSelectBoxesSuccess = createAction(
  "[Process Detail] Get process detail data for select boxes Success",
  props<{ payload: MimsSelectBoxModel[] }>()
);

export const processDetailFailure = createAction(
  "[Process Detail] Process detail failed",
  props<{ payload: any }>()
);
