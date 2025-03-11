import {
  MessagingActionTypes,
  MessagingActions,
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

export function reducer(
  state: MessagingState = initialState,
  action: MessagingActions
): MessagingState {
  switch (action.type) {
    case MessagingActionTypes.GetMessagingDataSuccess: {
      return {
        ...state,
        messagingData: action.payload,
      };
    }

    case MessagingActionTypes.ChangeCheckbox: {
      return {
        ...state,
        messagingToSave: findAndUpdateMessagingToSave(
          state.messagingToSave,
          state.messagingData,
          action.payload
        ),
      };
    }

    case MessagingActionTypes.ChangeSelectbox: {
      return {
        ...state,
        messagingData: updateOptionLoadData(
          state.messagingData,
          action.payload
        ),
        messagingToSave: updateOptionSaveData(
          state.messagingToSave,
          action.payload
        ),
      };
    }

    case MessagingActionTypes.UpdateMessagingDataSuccess: {
      return state;
    }

    default:
      return state;
  }
}

/**
 * Update array messagings load from api with the new selected option
 * @param messagingData messaging data from api
 * @param obj object with the messaging Id and with the new option
 */
export function updateOptionLoadData(messagingData: any[], obj: any) {
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
export function updateOptionSaveData(messagingToSave: any[], obj: any) {
  if (messagingToSave.length === 0) {
    return messagingToSave;
  }

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
export function findAndUpdateMessagingToSave(
  messagingToSaveState: MessagingSaveDataModelUI[],
  messagingDataState: MessagingLoadDataModelUI[],
  payload: number
): MessagingSaveDataModelUI[] {
  const messagingSave = Object.assign([], messagingToSaveState);
  const messagingData = Object.assign([], messagingDataState);

  const index = messagingSave.findIndex((elem) => {
    return elem.Id === payload;
  });

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
export function convertDataToSave(
  messagingData: MessagingLoadDataModelUI[],
  messagingId: number
): MessagingSaveDataModelUI {
  let convertedMessaging: MessagingSaveDataModelUI;
  const toConvert = messagingData.find((elem) => {
    return elem.Id === messagingId;
  });

  convertedMessaging = {
    Id: messagingId,
    Option: toConvert.Options.find((elem) => {
      return elem.selected === true;
    }),
  };

  return convertedMessaging;
}

/*
    Below are the selectors for this reducer. Make sure to make compact selectors as per
    requirements of your application.
*/

export const getMessagingData = (state: MessagingState) => state.messagingData;

export const getMessagingToSave = (state: MessagingState) =>
  state.messagingToSave;
