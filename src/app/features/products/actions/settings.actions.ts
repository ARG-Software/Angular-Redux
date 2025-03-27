import { createAction, props } from "@ngrx/store";
import { KanbanDataModelUI, WipDataModelUI } from "../models/settings.models";

// Load combined WIP + KanBan
export const loadSettingsData = createAction(
  "[Settings] Load Data",
  props<{ productId: number }>()
);

export const loadSettingsDataSuccess = createAction(
  "[Settings] Load Data Success",
  props<{ wip: WipDataModelUI[]; kanban: KanbanDataModelUI[] }>()
);

// WIP
export const updateWip = createAction(
  "[Settings] Update WIP",
  props<{ wip: WipDataModelUI[] }>()
);

export const updateWipSuccess = createAction(
  "[Settings] Update WIP Success",
  props<{ success: boolean }>()
);

// KanBan
export const updateKanBan = createAction(
  "[Settings] Update KanBan",
  props<{ kanban: KanbanDataModelUI[] }>()
);

export const updateKanBanSuccess = createAction(
  "[Settings] Update KanBan Success",
  props<{ success: boolean }>()
);

// Failure
export const settingsFailure = createAction(
  "[Settings] Settings Failure",
  props<{ error: any }>()
);
