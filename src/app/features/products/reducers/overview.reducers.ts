import { IShiftGraphicDto } from "src/app/api/models/apimodels";
import {
  OverviewActionTypes,
  OverviewActions,
} from "../actions/overview.actions";
import {
  DownTimeRecordChartModel,
  ChartSeriesModel,
} from "../models/overview.models";

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

export function reducer(
  state: OverviewState = initialState,
  action: OverviewActions
): OverviewState {
  switch (action.type) {
    case OverviewActionTypes.GetDownTimeChartSuccess: {
      const chartDataPayload = action.payload as IShiftGraphicDto[];
      const chartData =
        convertShiftGraphicListTodownTimeRecordChartDataModel(chartDataPayload);
      return { ...state, downTimeRecordChartData: chartData };
    }
    case OverviewActionTypes.GetMachineOperationTableSuccess: {
      const tableDataPayload = action.payload || [];
      return { ...state, machineOperationTableData: tableDataPayload };
    }
    default:
      return state;
  }
}

export function convertShiftGraphicListTodownTimeRecordChartDataModel(
  data: IShiftGraphicDto[]
): DownTimeRecordChartModel[] {
  const downTimeRecordChartDataModel: any[] = [];
  data.forEach((element) => {
    const graphicItem = {} as DownTimeRecordChartModel;
    graphicItem.name = element.Name ?? "";
    graphicItem.series = [];
    const uptimeObject = {} as ChartSeriesModel;
    const downtimeObject = {} as ChartSeriesModel;
    uptimeObject.name = "Uptime";
    uptimeObject.value = element.Uptime * 100;
    downtimeObject.name = "Downtime";
    downtimeObject.value = element.Downtime * 100;
    graphicItem.series.push(uptimeObject, downtimeObject);
    downTimeRecordChartDataModel.push(graphicItem);
  });
  return downTimeRecordChartDataModel;
}
/*
    Below are the selectors for this reducer. Make sure to make compact selectors as per
    requirements of your application.
*/

export const getOverviewState = (state: OverviewState) => state;

export const getDownTimeRecordChartData = (state: OverviewState) =>
  state.downTimeRecordChartData;

export const getMachineOperationTableData = (state: OverviewState) =>
  state.machineOperationTableData;

export const getMachineOperationTableColumns = (state: OverviewState) =>
  state.machineOperationTableColumns;

export const getMachineOperationsTableHeaderName = (state: OverviewState) =>
  state.machineOperationTableColumns;
