import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";
import { OeeChartDataModelUI, OeeTableDataModelUI } from "../models/oee.models";
import { PagingModelUI } from "src/app/app.models";

type OeeState = {
  oeeChartData: OeeChartDataModelUI[];
  oeeTableData: OeeTableDataModelUI[];
  currentPaging: PagingModelUI;
  machineSelectBox: MimsSelectBoxModel[];
  productSelectBox: MimsSelectBoxModel[];
};

export const OeeStore = signalStore(
  withState<OeeState>({
    oeeChartData: [],
    oeeTableData: [],
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
    setOeeData(
      chart: OeeChartDataModelUI[],
      table: OeeTableDataModelUI[],
      paging: PagingModelUI
    ) {
      patchState(store, {
        oeeChartData: chart,
        oeeTableData: table,
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
