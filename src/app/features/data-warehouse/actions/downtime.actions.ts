import { createAction, props } from "@ngrx/store";
import {
  MachiningRequestModelUI,
  DowntimeDataModelUI,
} from "../models/downtime.models";
import { MimsSelectBoxModel } from "../../../mims-ui/input/select-box/models/select-box.model";

export const getDowntimeData = createAction(
  "[Downtime] Get Downtime data",
  props<{ payload: MachiningRequestModelUI }>()
);

export const getDowntimeDataSuccess = createAction(
  "[Downtime] Get Downtime data Success",
  props<{ payload: DowntimeDataModelUI }>()
);

export const getDowntimeDataSelectBoxes = createAction(
  "[Downtime] Get Downtime data for select boxes",
  props<{ payload?: any }>()
);

export const getDowntimeDataSelectBoxesSuccess = createAction(
  "[Downtime] Get Downtime data for select boxes Success",
  props<{ payload: [MimsSelectBoxModel[], MimsSelectBoxModel[]] }>()
);

export const downtimeFailure = createAction(
  "[Downtime] Downtime Failed",
  props<{ payload: any }>()
);
