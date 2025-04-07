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
  processDetail: ProcessDetailState;
}

export const reducers: ActionReducerMap<DataWarehouseState, any> = {
  processDetail: processDetailReducer,
};

const getDataWarehouseState =
  createFeatureSelector<DataWarehouseState>(reducerName);

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
