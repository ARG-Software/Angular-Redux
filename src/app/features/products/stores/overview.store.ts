import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";
import { DownTimeRecordChartModel } from "../models/overview.models";

type OverviewState = {
  downTimeRecordChartData: DownTimeRecordChartModel[];
  machineOperationTableData: DataGridCellModel[];
  machineOperationTableColumns: string[];
  machineOperationsTableHeaderName: string[];
};

export const OverviewStore = signalStore(
  withState<OverviewState>({
    downTimeRecordChartData: [],
    machineOperationTableData: [],
    machineOperationTableColumns: ["AssetNumber", "OEE", "MDE"],
    machineOperationsTableHeaderName: ["Asset", "OEE", "MDE"],
  }),

  withMethods((store) => ({
    setDownTimeChart(data: DownTimeRecordChartModel[]) {
      patchState(store, {
        downTimeRecordChartData: data,
      });
    },

    setMachineOperationTable(data: DataGridCellModel[]) {
      patchState(store, {
        machineOperationTableData: data,
      });
    },
  }))
);
