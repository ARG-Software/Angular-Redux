import { createReducer, on } from "@ngrx/store";
import {
  getProcessDetailData,
  getProcessDetailDataSuccess,
  getProcessDetailDataSelectBoxesSuccess,
  processDetailFailure,
} from "../actions/process-detail.actions";

import {
  ProcessDetailChartModelUI,
  ProcessDetailTableModelUI,
} from "../models/process-detail.models";
import { PagingModelUI } from "src/app/app.models";
import { DEFAULT_PAGING } from "../../../app.constants";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface ProcessDetailState {
  processDetailChartData: ProcessDetailChartModelUI[];
  processDetailTableData: {
    Information: ProcessDetailTableModelUI[];
    CurrentPaging: PagingModelUI;
    RequestedPaging: PagingModelUI | null;
  };
  machineSelectBox: MimsSelectBoxModel[];
}

export const initialState: ProcessDetailState = {
  processDetailChartData: [],
  processDetailTableData: {
    Information: [],
    CurrentPaging: DEFAULT_PAGING,
    RequestedPaging: null,
  },
  machineSelectBox: [],
};

export const processDetailReducer = createReducer(
  initialState,

  on(getProcessDetailDataSelectBoxesSuccess, (state, { payload }) => ({
    ...state,
    machineSelectBox: [...payload],
  })),

  on(getProcessDetailData, (state, { payload }) => ({
    ...state,
    processDetailTableData: {
      ...state.processDetailTableData,
      RequestedPaging: {
        ...(state.processDetailTableData.RequestedPaging ?? DEFAULT_PAGING),
        ...payload.Paging,
      },
    },
  })),

  on(getProcessDetailDataSuccess, (state, { payload }) => ({
    ...state,
    processDetailTableData: {
      Information: [...payload.Table.Information],
      CurrentPaging: {
        ...(state.processDetailTableData.RequestedPaging ?? DEFAULT_PAGING),
      },
      RequestedPaging: null,
    },
    processDetailChartData: [...payload.Chart],
  })),

  on(processDetailFailure, (state) => ({
    ...state,
    processDetailTableData: {
      ...state.processDetailTableData,
      RequestedPaging: null,
    },
  }))
);

// Selectors
export const getProcessDetailChartData = (state: ProcessDetailState) =>
  state.processDetailChartData;

export const getProcessDetailTableData = (state: ProcessDetailState) =>
  state.processDetailTableData.Information;

export const getProcessDetailTablePagingData = (state: ProcessDetailState) =>
  state.processDetailTableData.CurrentPaging;

export const getProcessDetailMachineSelectData = (state: ProcessDetailState) =>
  state.machineSelectBox;
