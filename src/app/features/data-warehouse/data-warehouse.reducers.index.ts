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
import * as fromProcessDetailReducerDefinition from "./reducers/process-detail.reducer";
import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from "@ngrx/store";

export const reducerName = "data-warehouse";

export interface DataWarehouseState {
  downtime: DowntimeState;
  oee: OeeState;
  processDetail: fromProcessDetailReducerDefinition.ProcessDetailState;
}

export const reducers: ActionReducerMap<DataWarehouseState, any> = {
  downtime: downtimeReducer,
  oee: oeeReducer,
  processDetail: fromProcessDetailReducerDefinition.reducer as any,
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
  fromProcessDetailReducerDefinition.getProcessDetailChartData
);

export const getProcessDetailTable = createSelector(
  getProcessDetailState,
  fromProcessDetailReducerDefinition.getProcessDetailTableData
);

export const getProcessDetailTablePaging = createSelector(
  getProcessDetailState,
  fromProcessDetailReducerDefinition.getProcessDetailTablePaging
);

export const getProcessDetailMachineSelectData = createSelector(
  getProcessDetailState,
  fromProcessDetailReducerDefinition.getMachineSelectData
);
