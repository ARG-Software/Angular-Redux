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
import {
  configureReducer,
  ConfigureState,
  getEdgeSelectBoxData,
  getMachineOperationsDetailsData,
  getMachineOperationsUpdateStateData,
  getMachineSelectBoxData,
  getMessagesSelectBoxData,
  getMotesDetailsData,
  getMotesSelectBoxData,
  getMotesUpdateStateData,
  getOperationsDetailsData,
  getOperationsSelectBoxData,
  getOperationsUpdateStateData,
  getProductDetailData,
  getResumePageState,
  getSensorsDetailsData,
  getSensorUpdateStateData,
  getSubContractorsSelectBoxData,
} from "./reducers/configure.reducers";

export const reducerName = "products";

export interface ProductState {
  overview: OverviewState;
  settings: SettingsState;
  configure: ConfigureState;
}

export const reducers: any = {
  overview: overviewReducer,
  settings: settingsReducer,
  configure: configureReducer,
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
  getMachineSelectBoxData
);

export const getEdgeSelectBox = createSelector(
  getConfigureState,
  getEdgeSelectBoxData
);

export const getMotesSelectBox = createSelector(
  getConfigureState,
  getMotesSelectBoxData
);

export const getOperationsSelectBox = createSelector(
  getConfigureState,
  getOperationsSelectBoxData
);

export const getSubContractorsSelectBox = createSelector(
  getConfigureState,
  getSubContractorsSelectBoxData
);

export const getMessagesSelectBox = createSelector(
  getConfigureState,
  getMessagesSelectBoxData
);

export const getProductDetail = createSelector(
  getConfigureState,
  getProductDetailData
);

export const getOperationsDetails = createSelector(
  getConfigureState,
  getOperationsDetailsData
);

export const getOperationsUpdateState = createSelector(
  getConfigureState,
  getOperationsUpdateStateData
);

export const getMachineOperationsDetails = createSelector(
  getConfigureState,
  getMachineOperationsDetailsData
);

export const getMachineOperationsUpdateState = createSelector(
  getConfigureState,
  getMachineOperationsUpdateStateData
);

export const getMotesDetails = createSelector(
  getConfigureState,
  getMotesDetailsData
);

export const getMotesUpdateState = createSelector(
  getConfigureState,
  getMotesUpdateStateData
);

export const getSensorsDetails = createSelector(
  getConfigureState,
  getSensorsDetailsData
);

export const getSensorUpdateState = createSelector(
  getConfigureState,
  getSensorUpdateStateData
);

export const getResumePage = createSelector(
  getConfigureState,
  getResumePageState
);
