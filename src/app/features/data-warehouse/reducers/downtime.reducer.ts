import {
  DowntimeActions,
  DowntimeActionTypes,
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
    RequestedPaging: PagingModelUI;
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

export function reducer(
  state: DowntimeState = initialState,
  action: DowntimeActions
): DowntimeState {
  switch (action.type) {
    case DowntimeActionTypes.GetDowntimeDataSelectBoxesSuccess: {
      return {
        ...state,
        machineSelectBox: Object.assign(
          [],
          state.machineSelectBox,
          action.payload[0]
        ),
        productSelectBox: Object.assign(
          [],
          state.productSelectBox,
          action.payload[1]
        ),
      };
    }

    case DowntimeActionTypes.GetDowntimeData: {
      return {
        ...state,
        downtimeTableData: {
          ...state.downtimeTableData,
          RequestedPaging: Object.assign(
            {},
            state.downtimeTableData.RequestedPaging,
            action.payload.Paging
          ),
        },
      };
    }

    case DowntimeActionTypes.GetDowntimeDataSuccess: {
      return {
        ...state,
        downtimeTableData: {
          Information: Object.assign([], action.payload.Table.Information),
          CurrentPaging: Object.assign(
            {},
            state.downtimeTableData.RequestedPaging
          ),
          RequestedPaging: null,
        },
        downtimeChartData: Object.assign({}, action.payload.Chart),
      };
    }

    case DowntimeActionTypes.DowntimeFailure: {
      return {
        ...state,
        downtimeTableData: {
          ...state.downtimeTableData,
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
