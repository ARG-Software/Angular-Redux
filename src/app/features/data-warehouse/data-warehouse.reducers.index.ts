import {
  downtimeReducer,
  DowntimeState,
  getDowntimeChartData,
  getDowntimeTableData,
  getDowntimeTablePagingData,
  getDowntimeMachineSelectData,
  getDowntimeProductSelectData,
} from "./reducers/downtime.reducer";
import {
  getOeeChartData,
  getOeeTableData,
  oeeReducer,
  OeeState,
  getOeeMachineSelectData,
  getOeeProductSelectData,
  getOeeTablePagingData,
} from "./reducers/oee.reducer";
import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from "@ngrx/store";
import {
  getProcessDetailChartData,
  getProcessDetailMachineSelectData,
  getProcessDetailTableData,
  getProcessDetailTablePagingData,
  processDetailReducer,
  ProcessDetailState,
} from "./reducers/process-detail.reducer";

export const reducerName = "data-warehouse";

export interface DataWarehouseState {
  downtime: DowntimeState;
  oee: OeeState;
  processDetail: ProcessDetailState;
}

export const reducers: ActionReducerMap<DataWarehouseState, any> = {
  downtime: downtimeReducer,
  oee: oeeReducer,
  processDetail: processDetailReducer,
};

const getDataWarehouseState =
  createFeatureSelector<DataWarehouseState>(reducerName);

// Downtime
const getDowntimeState = createSelector(
  getDataWarehouseState,
  (state) => state.downtime
);

export const getDowntimeChart = createSelector(
  getDowntimeState,
  getDowntimeChartData
);

export const getDowntimeTable = createSelector(
  getDowntimeState,
  getDowntimeTableData
);

export const getDowntimeTablePaging = createSelector(
  getDowntimeState,
  getDowntimeTablePagingData
);

export const getDowntimeMachineSelect = createSelector(
  getDowntimeState,
  getDowntimeMachineSelectData
);

export const getDowntimeProductSelect = createSelector(
  getDowntimeState,
  getDowntimeProductSelectData
);

// Oee
const getOeeState = createSelector(getDataWarehouseState, (state) => state.oee);

export const getOeeChart = createSelector(getOeeState, getOeeChartData);

export const getOeeTable = createSelector(getOeeState, getOeeTableData);

export const getOeeTablePaging = createSelector(
  getOeeState,
  getOeeTablePagingData
);

export const getOeeMachineSelect = createSelector(
  getOeeState,
  getOeeMachineSelectData
);

export const getOeeProductSelect = createSelector(
  getOeeState,
  getOeeProductSelectData
);

// Process Detail
const getProcessDetailState = createSelector(
  getDataWarehouseState,
  (state) => state.processDetail
);

export const getProcessDetailChart = createSelector(
  getProcessDetailState,
  getProcessDetailChartData
);

export const getProcessDetailTable = createSelector(
  getProcessDetailState,
  getProcessDetailTableData
);

export const getProcessDetailTablePaging = createSelector(
  getProcessDetailState,
  getProcessDetailTablePagingData
);

export const getProcessDetailMachineSelect = createSelector(
  getProcessDetailState,
  getProcessDetailMachineSelectData
);
