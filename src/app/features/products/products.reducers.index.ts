import * as fromOverviewReducerDefinition from "./reducers/overview.reducers";
import * as fromSettingsReducerDefinition from "./reducers/settings.reducers";
import * as fromConfigureReducerDefiniton from "./reducers/configure.reducers";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { OverviewState } from "./reducers/overview.reducers";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";

export const reducerName = "products";

export interface ProductState {
  overview: fromOverviewReducerDefinition.OverviewState;
  settings: fromSettingsReducerDefinition.SettingsState;
  configure: fromConfigureReducerDefiniton.ConfigureState;
}

export const reducers: any = {
  overview: fromOverviewReducerDefinition.reducer,
  settings: fromSettingsReducerDefinition.reducer,
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
  fromOverviewReducerDefinition.getDownTimeRecordChartData
);

export const getMachineOperationTableData = createSelector(
  getOverviewState,
  (state: OverviewState): DataGridCellModel[] =>
    (state?.machineOperationTableData as DataGridCellModel[]) ?? []
);

export const getMachineOperationTableColumns = createSelector(
  getOverviewState,
  fromOverviewReducerDefinition.getMachineOperationTableColumns
);

export const getMachineOperationsTableHeaderName = createSelector(
  getOverviewState,
  fromOverviewReducerDefinition.getMachineOperationsTableHeaderName
);

// Settings
const getSettingstate = createSelector(
  getProductsState,
  (state) => state.settings
);

export const getWipData = createSelector(
  getSettingstate,
  fromSettingsReducerDefinition.getWipData
);

export const getKanBanData = createSelector(
  getSettingstate,
  fromSettingsReducerDefinition.getKanbanData
);

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
