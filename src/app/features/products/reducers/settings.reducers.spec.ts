import {
  loadSettingsDataSuccess,
  settingsFailure,
  updateKanBan,
  updateKanBanSuccess,
  updateWip,
  updateWipSuccess,
} from "../actions/settings.actions";
import {
  KanbanDataModelUIFactory,
  WipDataModelUIFactory,
} from "../models/settings.models";
import { initialState, settingsReducer } from "./settings.reducers";

describe("Settings Reducer", () => {
  const wip = WipDataModelUIFactory.buildList(2);
  const kanban = KanbanDataModelUIFactory.buildList(2);

  it("returns the initial state for an unknown action", () => {
    expect(settingsReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("stores loaded WIP and Kanban data", () => {
    expect(
      settingsReducer(initialState, loadSettingsDataSuccess({ wip, kanban }))
    ).toEqual({ wipData: wip, kanBanData: kanban });
  });

  it("updates WIP data optimistically", () => {
    expect(settingsReducer(initialState, updateWip({ wip }))).toEqual({
      ...initialState,
      wipData: wip,
    });
  });

  it("updates Kanban data optimistically", () => {
    expect(settingsReducer(initialState, updateKanBan({ kanban }))).toEqual({
      ...initialState,
      kanBanData: kanban,
    });
  });

  it("leaves state unchanged for completion and failure actions", () => {
    expect(
      settingsReducer(initialState, updateWipSuccess({ success: true }))
    ).toBe(initialState);
    expect(
      settingsReducer(initialState, updateKanBanSuccess({ success: true }))
    ).toBe(initialState);
    expect(
      settingsReducer(initialState, settingsFailure({ error: new Error("failed") }))
    ).toBe(initialState);
  });
});
