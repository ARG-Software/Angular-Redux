import { createAction, props } from "@ngrx/store";
import {
  MessagingRequestModelUI,
  MessagingSaveDataModelUI,
} from "../models/messaging.model";

export const getMessagingData = createAction(
  "[Messaging] Get messaging data",
  props<{ payload: MessagingRequestModelUI }>()
);

export const updateMessagingData = createAction(
  "[Messaging] Update messaging data",
  props<{ payload: MessagingSaveDataModelUI[] }>()
);

export const messagingFailure = createAction(
  "[Messaging] Messaging Failed",
  props<{ payload: any }>()
);
