import { Action } from "@ngrx/store";
import {
  MessagingLoadDataModelUI,
  MessagingRequestModelUI,
  MessagingSaveDataModelUI,
} from "../models/messaging.model";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export enum MessagingActionTypes {
  GetMessagingData = "[Messaging] Get messaging data",
  GetMessagingDataSuccess = "[Messaging] Get messaging data success",

  UpdateMessagingData = "[Messaging] Update messaging data",
  UpdateMessagingDataSuccess = "[Messaging] Update messaging data success",

  ChangeCheckbox = "[Messaging] Add/Remove from messagings to save",

  ChangeSelectbox = "[Messaging] Change the messaging option",

  MessagingFailure = "[Messaging] Messaging Failed",
}

export class GetMessagingData implements Action {
  public type = MessagingActionTypes.GetMessagingData;

  constructor(public payload: MessagingRequestModelUI) {}
}

export class GetMessagingDataSuccess implements Action {
  public type = MessagingActionTypes.GetMessagingDataSuccess;

  constructor(public payload: MessagingLoadDataModelUI[]) {}
}

export class UpdateMessagingData implements Action {
  public type = MessagingActionTypes.UpdateMessagingData;

  constructor(public payload: MessagingSaveDataModelUI[]) {}
}

export class UpdateMessagingDataSuccess implements Action {
  public type = MessagingActionTypes.UpdateMessagingDataSuccess;

  constructor(public payload: boolean) {}
}

export class ChangeCheckbox implements Action {
  public type = MessagingActionTypes.ChangeCheckbox;

  constructor(public payload: number) {}
}
export class ChangeSelectbox implements Action {
  public type = MessagingActionTypes.ChangeSelectbox;

  constructor(public payload: { Id: number; Option: MimsSelectBoxModel }) {}
}

export class MessagingFailure implements Action {
  public type = MessagingActionTypes.MessagingFailure;

  constructor(public payload: any) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type MessagingActions =
  | GetMessagingData
  | GetMessagingDataSuccess
  | UpdateMessagingData
  | UpdateMessagingDataSuccess
  | ChangeCheckbox
  | ChangeSelectbox
  | MessagingFailure;
