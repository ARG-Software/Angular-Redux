import { OeeActionTypes, OeeActions } from "../actions/oee.actions";
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

export function reducer(
  state: OeeState = initialState,
  action: OeeActions
): OeeState {
  switch (action.type) {
    case OeeActionTypes.GetOeeDataSelectBoxesSuccess: {
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

    case OeeActionTypes.GetOeeData: {
      return {
        ...state,
        oeeTableData: {
          ...state.oeeTableData,
          RequestedPaging: Object.assign(
            {},
            state.oeeTableData.RequestedPaging,
            action.payload.Paging
          ),
        },
      };
    }

    case OeeActionTypes.GetOeeDataSuccess: {
      return {
        ...state,
        oeeTableData: {
          Information: Object.assign([], action.payload.Table.Information),
          CurrentPaging: Object.assign({}, state.oeeTableData.RequestedPaging),
          RequestedPaging: null,
        },
        oeeChartData: Object.assign([], action.payload.Chart),
      };
    }

    case OeeActionTypes.OeeFailure: {
      return {
        ...state,
        oeeTableData: {
          ...state.oeeTableData,
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

export const getOeeChartData = (state: OeeState) => state.oeeChartData;

export const getOeeTableData = (state: OeeState) =>
  state.oeeTableData.Information;

export const getOeeTablePaging = (state: OeeState) =>
  state.oeeTableData.CurrentPaging;

export const getMachineSelectData = (state: OeeState) => state.machineSelectBox;

export const getProductSelectData = (state: OeeState) => state.productSelectBox;
