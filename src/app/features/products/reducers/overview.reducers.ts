import { createReducer, on } from "@ngrx/store";
import {
  getDownTimeChartSuccess,
  getMachineOperationTableSuccess,
} from "../actions/overview.actions";
import {
  DownTimeRecordChartModel,
  ChartSeriesModel,
} from "../models/overview.models";
import { IShiftGraphicDto } from "src/app/api/models/apimodels";

export interface OverviewState {
  downTimeRecordChartData?: DownTimeRecordChartModel[];
  machineOperationTableData?: object;
  machineOperationTableColumns: string[];
  machineOperationsTableHeaderName: string[];
}

export const initialState: OverviewState = {
  downTimeRecordChartData: undefined,
  machineOperationTableData: [],
  machineOperationTableColumns: ["AssetNumber", "OEE", "MDE"],
  machineOperationsTableHeaderName: ["Asset", "OEE", "MDE"],
};

export const overviewReducer = createReducer(
  initialState,

  on(getDownTimeChartSuccess, (state, { payload }) => ({
    ...state,
    downTimeRecordChartData: convertShiftGraphicListToChartData(payload),
  })),

  on(getMachineOperationTableSuccess, (state, { payload }) => ({
    ...state,
    machineOperationTableData: payload ?? [],
  }))
);

function convertShiftGraphicListToChartData(
  data: IShiftGraphicDto[]
): DownTimeRecordChartModel[] {
  return data.map((element) => ({
    name: element.Name ?? "",
    series: [
      {
        name: "Uptime",
        value: element.Uptime * 100,
      },
      {
        name: "Downtime",
        value: element.Downtime * 100,
      },
    ],
  }));
}

// Selectors
export const getOverviewState = (state: OverviewState) => state;

export const getDownTimeRecordChartData = (state: OverviewState) =>
  state.downTimeRecordChartData;

export const getMachineOperationTableData = (state: OverviewState) =>
  state.machineOperationTableData;

export const getMachineOperationTableColumnsData = (state: OverviewState) =>
  state.machineOperationTableColumns;

export const getMachineOperationsTableHeaderNameData = (state: OverviewState) =>
  state.machineOperationsTableHeaderName;
