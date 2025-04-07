import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { PagingModelUI } from "src/app/app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";
import {
  ComboChartDataModelUI,
  DowntimeTableDataModelUI,
} from "../models/downtime.models";

type DowntimeState = {
  downtimeChartData: ComboChartDataModelUI;
  downtimeTableData: DowntimeTableDataModelUI[];
  currentPaging: PagingModelUI;
  machineSelectBox: MimsSelectBoxModel[];
  productSelectBox: MimsSelectBoxModel[];
};

export const DowntimeStore = signalStore(
  withState<DowntimeState>({
    downtimeChartData: { Bar: [], Line: [] },
    downtimeTableData: [],
    currentPaging: {
      CurrentIndex: 0,
      HowManyPerPage: 5,
      PropertyToOrderBy: "AssetNumber",
      Total: 0,
      Ordered: true,
      IsDescending: true,
    },
    machineSelectBox: [],
    productSelectBox: [],
  }),

  withMethods((store) => ({
    setDowntimeData(
      chart: ComboChartDataModelUI,
      table: DowntimeTableDataModelUI[],
      paging: PagingModelUI
    ) {
      patchState(store, {
        downtimeChartData: chart,
        downtimeTableData: table,
        currentPaging: paging,
      });
    },

    setSelectBoxes(
      machine: MimsSelectBoxModel[],
      product: MimsSelectBoxModel[]
    ) {
      patchState(store, {
        machineSelectBox: machine,
        productSelectBox: product,
      });
    },
  }))
);
