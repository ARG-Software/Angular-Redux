import * as fromConfigureReducerDefiniton from "./reducers/configure.reducers";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import {
  getDownTimeRecordChartData,
  getMachineOperationsTableHeaderNameData,
  getMachineOperationTableColumnsData,
  overviewReducer,
  OverviewState,
} from "./reducers/overview.reducers";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";
import {
  getKanbanData,
  getWipData,
  settingsReducer,
  SettingsState,
} from "./reducers/settings.reducers";

export const reducerName = "products";

export interface ProductState {
  overview: OverviewState;
  settings: SettingsState;
  configure: fromConfigureReducerDefiniton.ConfigureState;
}

export const reducers: any = {
  overview: overviewReducer,
  settings: settingsReducer,
  configure: fromConfigureReducerDefiniton.reducer,
};

const getProductsState = createFeatureSelector<ProductState>(reducerName);

// Overview

const getOverviewState = createSelector(
  getProductsState,
  (state) => state.overview
);

export const getDownTimeRecordChart = createSelector(
  getOverviewState,
  getDownTimeRecordChartData
);

export const getMachineOperationTableData = createSelector(
  getOverviewState,
  (state: OverviewState): DataGridCellModel[] =>
    (state?.machineOperationTableData as DataGridCellModel[]) ?? []
);

export const getMachineOperationTableColumns = createSelector(
  getOverviewState,
  getMachineOperationTableColumnsData
);

export const getMachineOperationsTableHeaderName = createSelector(
  getOverviewState,
  getMachineOperationsTableHeaderNameData
);

// Settings
const getSettingstate = createSelector(
  getProductsState,
  (state) => state.settings
);

export const getWip = createSelector(getSettingstate, getWipData);

export const getKanBan = createSelector(getSettingstate, getKanbanData);

// Configure

const getConfigureState = createSelector(
  getProductsState,
  (state) => state.configure
);

export const getMachineSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMachineSelectBox
);

export const getEdgeSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getEdgesSelectBox
);

export const getMotesSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMoteSelectBox
);

export const getOperationsSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getOperationsSelectBox
);

export const getSubContractorsSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getSubContractorsSelectBox
);

export const getMessagesSelectBox = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMessagesSelectBox
);

export const getProductDetail = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getProductDetail
);

export const getOperationsDetails = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getOperationsDetails
);

export const getOperationsUpdateState = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getOperationsUpdateState
);

export const getMachineOperationsDetails = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMachineOperationsDetails
);

export const getMachineOperationsUpdateState = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMachineOperationsUpdateState
);

export const getMotesDetails = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMotesDetails
);

export const getMotesUpdateState = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getMotesUpdateState
);

export const getSensorsDetails = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getSensorsDetails
);

export const getSensorUpdateState = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getSensorUpdateState
);

export const getResumePage = createSelector(
  getConfigureState,
  fromConfigureReducerDefiniton.getResumePageState
);
