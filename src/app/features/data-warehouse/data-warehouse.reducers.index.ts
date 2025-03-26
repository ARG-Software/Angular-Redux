import {
  downtimeReducer,
  DowntimeState,
  getDowntimeChartData,
  getDowntimeTableData,
  getDowntimeTablePaging,
  getMachineSelectData,
  getProductSelectData,
} from "./reducers/downtime.reducer";
import * as fromOeeReducerDefinition from "./reducers/oee.reducer";
import * as fromProcessDetailReducerDefinition from "./reducers/process-detail.reducer";
import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from "@ngrx/store";

export const reducerName = "data-warehouse";

export interface DataWarehouseState {
  downtime: DowntimeState;
  oee: fromOeeReducerDefinition.OeeState;
  processDetail: fromProcessDetailReducerDefinition.ProcessDetailState;
}

export const reducers: ActionReducerMap<DataWarehouseState, any> = {
  downtime: downtimeReducer,
  oee: fromOeeReducerDefinition.reducer as any,
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
  getDowntimeTablePaging
);

export const getDowntimeMachineSelectData = createSelector(
  getDowntimeState,
  getMachineSelectData
);

export const getDowntimeProductSelectData = createSelector(
  getDowntimeState,
  getProductSelectData
);

// Oee
const getOeeState = createSelector(getDataWarehouseState, (state) => state.oee);

export const getOeeChart = createSelector(
  getOeeState,
  fromOeeReducerDefinition.getOeeChartData
);

export const getOeeTable = createSelector(
  getOeeState,
  fromOeeReducerDefinition.getOeeTableData
);

export const getOeeTablePaging = createSelector(
  getOeeState,
  fromOeeReducerDefinition.getOeeTablePaging
);

export const getOeeMachineSelectData = createSelector(
  getOeeState,
  fromOeeReducerDefinition.getMachineSelectData
);

export const getOeeProductSelectData = createSelector(
  getOeeState,
  fromOeeReducerDefinition.getProductSelectData
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
