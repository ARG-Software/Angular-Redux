import { createReducer, on } from "@ngrx/store";
import {
  getMessagingDataSuccess,
  changeCheckbox,
  changeSelectbox,
  updateMessagingDataSuccess,
} from "../actions/messaging.actions";
import {
  MessagingLoadDataModelUI,
  MessagingSaveDataModelUI,
} from "../models/messaging.model";

export interface MessagingState {
  messagingData: MessagingLoadDataModelUI[];
  messagingToSave: MessagingSaveDataModelUI[];
}

export const initialState: MessagingState = {
  messagingData: [],
  messagingToSave: [],
};

export const messagingReducer = createReducer(
  initialState,

  on(getMessagingDataSuccess, (state, { payload }) => ({
    ...state,
    messagingData: payload,
  })),

  on(changeCheckbox, (state, { payload }) => ({
    ...state,
    messagingToSave: findAndUpdateMessagingToSave(
      state.messagingToSave,
      state.messagingData,
      payload
    ),
  })),

  on(changeSelectbox, (state, { payload }) => ({
    ...state,
    messagingData: updateOptionLoadData(state.messagingData, payload),
    messagingToSave: updateOptionSaveData(state.messagingToSave, payload),
  })),

  on(updateMessagingDataSuccess, (state) => ({
    ...state,
    // Optionally reset state here if needed after save
  }))
);

// utils reused from original reducer file...
/**
 * Update array messagings load from api with the new selected option
 * @param messagingData messaging data from api
 * @param obj object with the messaging Id and with the new option
 */
function updateOptionLoadData(messagingData: any[], obj: any) {
  return messagingData.map((message) =>
    message.Id === obj.Id
      ? {
          ...message,
          Options: message.Options.map((option: any) => ({
            ...option,
            selected: option.value === obj.Option.value,
          })),
        }
      : message
  );
}

/**
 * Update array with messagings with the new selected option
 * @param messagingToSave state with messagings to save
 * @param obj object with the messaging Id and with the new option
 */
function updateOptionSaveData(messagingToSave: any[], obj: any) {
  if (messagingToSave.length === 0) return messagingToSave;

  messagingToSave.forEach((elem) => {
    if (elem.Id === obj.Id) {
      elem.Option = obj.Option;
    }
  });

  return messagingToSave;
}

/**
 * Find messaging in array and update information or add new entry
 * @param messagingToSave state with array of messaging
 * @param messaging messagin to update
 */
function findAndUpdateMessagingToSave(
  messagingToSaveState: MessagingSaveDataModelUI[],
  messagingDataState: MessagingLoadDataModelUI[],
  payload: number
): MessagingSaveDataModelUI[] {
  const messagingSave = [...messagingToSaveState];
  const messagingData = [...messagingDataState];

  const index = messagingSave.findIndex((elem) => elem.Id === payload);

  index > -1
    ? messagingSave.splice(index, 1)
    : messagingSave.push(convertDataToSave(messagingData, payload));

  return messagingSave;
}

/**
 * COnvert type of data to be saved in backend
 * @param messagingData Array with messaging data
 * @param messagingId id of the messagign to convert to be saved in backend
 */
function convertDataToSave(
  messagingData: MessagingLoadDataModelUI[],
  messagingId: number
): MessagingSaveDataModelUI {
  const toConvert = messagingData.find((elem) => elem.Id === messagingId)!;

  return {
    Id: messagingId,
    Option: toConvert.Options.find((elem) => elem.selected === true)!,
  };
}

// Selectors
export const getMessagingData = (state: MessagingState) => state.messagingData;
export const getMessagingToSave = (state: MessagingState) =>
  state.messagingToSave;
