import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from "@angular/core";

import { Store } from "@ngrx/store";
import * as fromReducer from "../../../data-warehouse.reducers.index";
import { Observable } from "rxjs";
import {
  ComboChartDataModelUI,
  DowntimeTableDataModelUI,
} from "../../../models/downtime.models";
import {
  getDowntimeData,
  getDowntimeDataSelectBoxes,
} from "../../../actions/downtime.actions";
import { getTodayDateMinusInputDays } from "../../../../../utils/funtion.utils";
import { MachiningRequestModelUI } from "../../../models/downtime.models";
import { PagingModelUI } from "src/app/app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";
import { DowntimeStore } from "../../../stores/downtime.store";

@Component({
  standalone: false,
  selector: "downtime",
  templateUrl: "./downtime.component.html",
  styleUrls: ["./downtime.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DowntimeComponent implements OnInit {
  public chartColors = {
    Bar: {
      domain: ["#01579b"],
    },
    Line: {
      domain: ["#996633", "#a8385d", "#00bfa5", "#ff0000", "#00ff99"],
    },
  };

  public chartSize = [1100, 400];

  private readonly store = inject(Store);
  private readonly downtimeStore = inject(DowntimeStore);

  public readonly chartData = this.downtimeStore.downtimeChartData;
  public readonly tableData = this.downtimeStore.downtimeTableData;
  public readonly tablePaging = this.downtimeStore.currentPaging;
  public readonly machineSelectBoxData = this.downtimeStore.machineSelectBox;
  public readonly productSelectBoxData = this.downtimeStore.productSelectBox;

  public request: MachiningRequestModelUI = {
    Filters: {
      MachineId: 0,
      ProductId: 0,
      StartDate: getTodayDateMinusInputDays(14),
      EndDate: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    Paging: {
      CurrentIndex: 0,
      HowManyPerPage: 5,
      PropertyToOrderBy: "AssetNumber",
      Total: 0,
      Ordered: true,
      IsDescending: true,
    },
  };

  ngOnInit() {
    this.store.dispatch(getDowntimeDataSelectBoxes());
    this.store.dispatch(getDowntimeData({ payload: this.request }));
  }

  public requestNewPage(pageNumber: number) {
    this.request.Paging.CurrentIndex = pageNumber - 1;
    this.store.dispatch(getDowntimeData({ payload: this.request }));
  }

  public filtersOptions(filters: any) {
    this.request = {
      ...this.request,
      Filters: { ...filters },
    };
    this.store.dispatch(getDowntimeData({ payload: this.request }));
  }
}
