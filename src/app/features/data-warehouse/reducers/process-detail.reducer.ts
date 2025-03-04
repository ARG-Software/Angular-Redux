import {
  ProcessDetailActionTypes,
  ProcessDetailActions,
} from "../actions/process-detail.actions";
import {
  ProcessDetailChartModelUI,
  ProcessDetailTableModelUI,
} from "../models/process-detail.models";
import { DEFAULT_PAGING } from "../../../app.constants";
import { PagingModelUI } from "../../../app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

// TODO: correct initial state when doing effects and we receive data from services
export interface ProcessDetailState {
  processDetailChartData: ProcessDetailChartModelUI[];
  processDetailTableData: {
    Information: ProcessDetailTableModelUI[];
    CurrentPaging: PagingModelUI;
    RequestedPaging: PagingModelUI;
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

export function reducer(
  state: ProcessDetailState = initialState,
  action: ProcessDetailActions
): ProcessDetailState {
  switch (action.type) {
    case ProcessDetailActionTypes.GetProcessDetailDataSelectBoxesSuccess: {
      return {
        ...state,
        machineSelectBox: Object.assign(
          [],
          state.machineSelectBox,
          action.payload
        ),
      };
    }

    case ProcessDetailActionTypes.GetProcessDetailData: {
      return {
        ...state,
        processDetailTableData: {
          ...state.processDetailTableData,
          RequestedPaging: Object.assign(
            {},
            state.processDetailTableData.RequestedPaging,
            action.payload.Paging
          ),
        },
      };
    }

    case ProcessDetailActionTypes.GetProcessDetailDataSuccess: {
      return {
        ...state,
        processDetailTableData: {
          Information: Object.assign([], action.payload.Table.Information),
          CurrentPaging: Object.assign(
            {},
            state.processDetailTableData.RequestedPaging
          ),
          RequestedPaging: null,
        },
        processDetailChartData: Object.assign([], action.payload.Chart),
      };
    }

    case ProcessDetailActionTypes.ProcessDetailFailure: {
      return {
        ...state,
        processDetailTableData: {
          ...state.processDetailTableData,
          RequestedPaging: null,
        },
      };
    }

    default:
      return state;
  }
}

/*
    Below are the selectors for this reducer. Make sure to make compact selectors as per
    requirements of your application.
*/
export const getProcessDetailChartData = (state: ProcessDetailState) =>
  state.processDetailChartData;

export const getProcessDetailTableData = (state: ProcessDetailState) =>
  state.processDetailTableData.Information;

export const getProcessDetailTablePaging = (state: ProcessDetailState) =>
  state.processDetailTableData.CurrentPaging;

export const getMachineSelectData = (state: ProcessDetailState) =>
  state.machineSelectBox;
