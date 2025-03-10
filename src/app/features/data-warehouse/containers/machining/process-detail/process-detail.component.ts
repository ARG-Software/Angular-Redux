import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromReducer from "../../../data-warehouse.reducers.index";
import { Observable } from "rxjs";

import {
  GetProcessDetailData,
  GetProcessDetailDataSelectBoxes,
} from "../../../actions/process-detail.actions";
import {
  ProcessDetailChartModelUI,
  ProcessDetailTableModelUI,
} from "../../../models/process-detail.models";
import { MachiningRequestModelUI } from "../../../models/downtime.models";
import { getTodayDateMinusInputDays } from "../../../../../utils/funtion.utils";
import { PagingModelUI } from "src/app/app.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "process-detail",
  templateUrl: "./process-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessDetailComponent implements OnInit {
  protected chartSize = [1100, 400];
  protected tableData$: Observable<ProcessDetailTableModelUI[]>;
  protected tablePaging$: Observable<PagingModelUI>;
  protected chartData$: Observable<ProcessDetailChartModelUI[]>;
  protected machineSelectBoxData$: Observable<MimsSelectBoxModel[]>;
  protected tableHeaders = [
    "Machine State",
    "Reason",
    "Duration",
    "Start Time",
    "End Time",
  ];

  protected columnNames = [
    "MachineState",
    "Reason",
    "Duration",
    "StartTime",
    "EndTime",
  ];
  protected request: MachiningRequestModelUI = {
    Filters: {
      MachineId: 0,
      ProductId: 0,
      StartDate: getTodayDateMinusInputDays(0),
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

  constructor(private store: Store<fromReducer.DataWarehouseState>) {
    this.chartData$ = this.store.select(fromReducer.getProcessDetailChart);
    this.tableData$ = this.store.select(fromReducer.getProcessDetailTable);
    this.tablePaging$ = this.store.select(
      fromReducer.getProcessDetailTablePaging
    );
    this.machineSelectBoxData$ = this.store.select(
      fromReducer.getProcessDetailMachineSelectData
    );
  }

  public ngOnInit() {
    this.store.dispatch(new GetProcessDetailDataSelectBoxes());
    this.store.dispatch(new GetProcessDetailData(this.request));
  }

  /**
   * Request new page to backend
   * @param pageNumber the numer of the page that we want
   */
  protected requestNewPage(pageNumber: number) {
    this.request = {
      ...this.request,
      Paging: {
        ...this.request.Paging,
        CurrentIndex: pageNumber - 1,
      },
    };
    this.store.dispatch(new GetProcessDetailData(this.request));
  }

  /**
   * Request data with new filters
   * @param filters new selected filters
   */
  protected filtersOptions(filters: any) {
    this.request = {
      ...this.request,
      Filters: { ...filters },
    };
    this.store.dispatch(new GetProcessDetailData(this.request));
  }
}
