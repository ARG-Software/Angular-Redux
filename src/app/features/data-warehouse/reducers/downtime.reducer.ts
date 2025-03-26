import { createReducer, on } from "@ngrx/store";
import {
  getDowntimeData,
  getDowntimeDataSuccess,
  getDowntimeDataSelectBoxesSuccess,
  downtimeFailure,
} from "../actions/downtime.actions";

import {
  ComboChartDataModelUI,
  DowntimeTableDataModelUI,
} from "../models/downtime.models";

import { DEFAULT_PAGING } from "../../../app.constants";
import { PagingModelUI } from "../../../app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface DowntimeState {
  downtimeTableData: {
    Information: DowntimeTableDataModelUI[];
    CurrentPaging: PagingModelUI;
    RequestedPaging: PagingModelUI | null;
  };
  downtimeChartData: ComboChartDataModelUI;
  machineSelectBox: MimsSelectBoxModel[];
  productSelectBox: MimsSelectBoxModel[];
}

export const initialState: DowntimeState = {
  downtimeTableData: {
    Information: [],
    CurrentPaging: DEFAULT_PAGING,
    RequestedPaging: null,
  },
  downtimeChartData: {
    Bar: [],
    Line: [],
  },
  machineSelectBox: [],
  productSelectBox: [],
};

export const downtimeReducer = createReducer(
  initialState,

  on(getDowntimeDataSelectBoxesSuccess, (state, { payload }) => ({
    ...state,
    machineSelectBox: [...payload[0]],
    productSelectBox: [...payload[1]],
  })),

  on(getDowntimeData, (state, { payload }) => ({
    ...state,
    downtimeTableData: {
      ...state.downtimeTableData,
      RequestedPaging: {
        ...state.downtimeTableData.RequestedPaging,
        ...payload.Paging,
      },
    },
  })),

  on(getDowntimeDataSuccess, (state, { payload }) => ({
    ...state,
    downtimeTableData: {
      Information: [...payload.Table.Information],
      CurrentPaging: {
        ...(state.downtimeTableData.RequestedPaging ?? DEFAULT_PAGING),
      },
      RequestedPaging: null,
    },
    downtimeChartData: { ...payload.Chart },
  })),

  on(downtimeFailure, (state) => ({
    ...state,
    downtimeTableData: {
      ...state.downtimeTableData,
      RequestedPaging: null,
    },
  }))
);

/*
    Below are the selectors for this reducer. Make sure to make compact selectors as per
    requirements of your application.
*/
export const getDowntimeChartData = (state: DowntimeState) =>
  state.downtimeChartData;

export const getDowntimeTableData = (state: DowntimeState) =>
  state.downtimeTableData.Information;

export const getDowntimeTablePaging = (state: DowntimeState) =>
  state.downtimeTableData.CurrentPaging;

export const getMachineSelectData = (state: DowntimeState) =>
  state.machineSelectBox;

export const getProductSelectData = (state: DowntimeState) =>
  state.productSelectBox;
