import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import {
  MessagingLoadDataModelUI,
  MessagingSaveDataModelUI,
} from "../models/messaging.model";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

type MessagingState = {
  messagingData: MessagingLoadDataModelUI[];
  messagingToSave: MessagingSaveDataModelUI[];
};

export const MessagingStore = signalStore(
  withState<MessagingState>({
    messagingData: [],
    messagingToSave: [],
  }),

  withMethods((store) => ({
    setMessagingData(data: MessagingLoadDataModelUI[]) {
      patchState(store, { messagingData: data });
    },

    updateSelectBox(id: number, option: MimsSelectBoxModel) {
      patchState(store, (state) => ({
        messagingData: state.messagingData.map((item) =>
          item.Id === id
            ? {
                ...item,
                Options: item.Options.map((opt) => ({
                  ...opt,
                  selected: opt.value === option.value,
                })),
              }
            : item
        ),
        messagingToSave: state.messagingToSave.map((item) =>
          item.Id === id ? { ...item, Option: option } : item
        ),
      }));
    },

    toggleCheckbox(id: number) {
      patchState(store, (state) => {
        const exists = state.messagingToSave.find((msg) => msg.Id === id);
        const updatedToSave = exists
          ? state.messagingToSave.filter((msg) => msg.Id !== id)
          : [
              ...state.messagingToSave,
              {
                Id: id,
                Option: state.messagingData
                  .find((msg) => msg.Id === id)!
                  .Options.find((opt) => opt.selected)!,
              },
            ];

        return {
          messagingToSave: updatedToSave,
        };
      });
    },
  }))
);
