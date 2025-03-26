import { createReducer, on } from "@ngrx/store";
import {
  getOeeData,
  getOeeDataSuccess,
  getOeeDataSelectBoxesSuccess,
  oeeFailure,
} from "../actions/oee.actions";

import { OeeChartDataModelUI, OeeTableDataModelUI } from "../models/oee.models";
import { DEFAULT_PAGING } from "../../../app.constants";
import { PagingModelUI } from "../../../app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface OeeState {
  oeeChartData: OeeChartDataModelUI[];
  oeeTableData: {
    Information: OeeTableDataModelUI[];
    CurrentPaging: PagingModelUI;
    RequestedPaging: PagingModelUI | null;
  };
  machineSelectBox: MimsSelectBoxModel[];
  productSelectBox: MimsSelectBoxModel[];
}

export const initialState: OeeState = {
  oeeChartData: [],
  oeeTableData: {
    Information: [],
    CurrentPaging: DEFAULT_PAGING,
    RequestedPaging: null,
  },
  machineSelectBox: [],
  productSelectBox: [],
};

export const oeeReducer = createReducer(
  initialState,

  on(getOeeDataSelectBoxesSuccess, (state, { payload }) => ({
    ...state,
    machineSelectBox: [...payload[0]],
    productSelectBox: [...payload[1]],
  })),

  on(getOeeData, (state, { payload }) => ({
    ...state,
    oeeTableData: {
      ...state.oeeTableData,
      RequestedPaging: {
        ...(state.oeeTableData.RequestedPaging ?? DEFAULT_PAGING),
        ...payload.Paging,
      },
    },
  })),

  on(getOeeDataSuccess, (state, { payload }) => ({
    ...state,
    oeeTableData: {
      Information: [...payload.Table.Information],
      CurrentPaging: {
        ...(state.oeeTableData.RequestedPaging ?? DEFAULT_PAGING),
      },
      RequestedPaging: null,
    },
    oeeChartData: [...payload.Chart],
  })),

  on(oeeFailure, (state) => ({
    ...state,
    oeeTableData: {
      ...state.oeeTableData,
      RequestedPaging: null,
    },
  }))
);

// Selectors
export const getOeeChartData = (state: OeeState) => state.oeeChartData;
export const getOeeTableData = (state: OeeState) =>
  state.oeeTableData.Information;
export const getOeeTablePagingData = (state: OeeState) =>
  state.oeeTableData.CurrentPaging;
export const getOeeMachineData = (state: OeeState) => state.machineSelectBox;
export const getOeeProductData = (state: OeeState) => state.productSelectBox;
