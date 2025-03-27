import { createAction, props } from "@ngrx/store";
import {
  MessagingLoadDataModelUI,
  MessagingRequestModelUI,
  MessagingSaveDataModelUI,
} from "../models/messaging.model";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export const getMessagingData = createAction(
  "[Messaging] Get messaging data",
  props<{ payload: MessagingRequestModelUI }>()
);

export const getMessagingDataSuccess = createAction(
  "[Messaging] Get messaging data success",
  props<{ payload: MessagingLoadDataModelUI[] }>()
);

export const updateMessagingData = createAction(
  "[Messaging] Update messaging data",
  props<{ payload: MessagingSaveDataModelUI[] }>()
);

export const updateMessagingDataSuccess = createAction(
  "[Messaging] Update messaging data success",
  props<{ payload: boolean }>()
);

export const changeCheckbox = createAction(
  "[Messaging] Add/Remove from messagings to save",
  props<{ payload: number }>()
);

export const changeSelectbox = createAction(
  "[Messaging] Change the messaging option",
  props<{ payload: { Id: number; Option: MimsSelectBoxModel } }>()
);

export const messagingFailure = createAction(
  "[Messaging] Messaging Failed",
  props<{ payload: any }>()
);
