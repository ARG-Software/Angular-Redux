import {
  downtimeReducer,
  DowntimeState,
  getDowntimeChartData,
  getDowntimeTableData,
  getDowntimeTablePagingData,
  getDowntimeMachineData,
  getDowntimeProductData,
} from "./reducers/downtime.reducer";
import {
  getOeeChartData,
  getOeeTableData,
  oeeReducer,
  OeeState,
  getOeeMachineData,
  getOeeProductData,
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

export const getDownTimeChart = createSelector(
  getDowntimeState,
  getDowntimeChartData
);

export const getDownTimeTable = createSelector(
  getDowntimeState,
  getDowntimeTableData
);

export const getDownTimeTablePaging = createSelector(
  getDowntimeState,
  getDowntimeTablePagingData
);

export const getDowntimeMachineSelectData = createSelector(
  getDowntimeState,
  getDowntimeMachineData
);

export const getDowntimeProductSelectData = createSelector(
  getDowntimeState,
  getDowntimeProductData
);

// Oee
const getOeeState = createSelector(getDataWarehouseState, (state) => state.oee);

export const getOeeChart = createSelector(getOeeState, getOeeChartData);

export const getOeeTable = createSelector(getOeeState, getOeeTableData);

export const getOeeTablePaging = createSelector(
  getOeeState,
  getOeeTablePagingData
);

export const getOeeMachineSelectData = createSelector(
  getOeeState,
  getOeeMachineData
);

export const getOeeProductSelectData = createSelector(
  getOeeState,
  getOeeProductData
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
