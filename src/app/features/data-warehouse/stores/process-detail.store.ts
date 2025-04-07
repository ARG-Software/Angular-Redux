import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";

import { MimsSelectBoxModel } from "../../../mims-ui/input/select-box/models/select-box.model";
import {
  ProcessDetailChartModelUI,
  ProcessDetailTableModelUI,
} from "../models/process-detail.models";
import { PagingModelUI } from "src/app/app.models";

type ProcessDetailState = {
  chartData: ProcessDetailChartModelUI[];
  tableData: ProcessDetailTableModelUI[];
  paging: PagingModelUI;
  machineSelectBox: MimsSelectBoxModel[];
};

export const ProcessDetailStore = signalStore(
  withState<ProcessDetailState>({
    chartData: [],
    tableData: [],
    paging: {
      CurrentIndex: 0,
      HowManyPerPage: 5,
      PropertyToOrderBy: "AssetNumber",
      Total: 0,
      Ordered: true,
      IsDescending: true,
    },
    machineSelectBox: [],
  }),

  withMethods((store) => ({
    setProcessDetailData(
      chart: ProcessDetailChartModelUI[],
      table: ProcessDetailTableModelUI[],
      paging: PagingModelUI
    ) {
      patchState(store, {
        chartData: chart,
        tableData: table,
        paging,
      });
    },

    setSelectBoxes(machine: MimsSelectBoxModel[]) {
      patchState(store, {
        machineSelectBox: machine,
      });
    },
  }))
);
