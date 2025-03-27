import { createReducer, on } from "@ngrx/store";
import * as SettingsActions from "../actions/settings.actions";
import { KanbanDataModelUI, WipDataModelUI } from "../models/settings.models";

export interface SettingsState {
  wipData: WipDataModelUI[];
  kanBanData: KanbanDataModelUI[];
}

export const initialState: SettingsState = {
  wipData: [],
  kanBanData: [],
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.loadSettingsDataSuccess, (state, { wip, kanban }) => ({
    ...state,
    wipData: wip,
    kanBanData: kanban,
  })),
  on(SettingsActions.updateWip, (state, { wip }) => ({
    ...state,
    wipData: wip,
  })),
  on(SettingsActions.updateKanBan, (state, { kanban }) => ({
    ...state,
    kanBanData: kanban,
  }))
);

// Selectors
export const getWipData = (state: SettingsState) => state.wipData;
export const getKanbanData = (state: SettingsState) => state.kanBanData;
