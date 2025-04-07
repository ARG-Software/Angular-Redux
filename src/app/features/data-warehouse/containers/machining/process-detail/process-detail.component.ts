import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { ProcessDetailStore } from "../../../stores/process-detail.store";
import { MachiningRequestModelUI } from "../../../models/downtime.models";
import { getTodayDateMinusInputDays } from "src/app/utils/funtion.utils";
import {
  getProcessDetailData,
  getProcessDetailDataSelectBoxes,
} from "../../../actions/process-detail.actions";

@Component({
  standalone: false,
  selector: "process-detail",
  templateUrl: "./process-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessDetailComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly processDetailStore = inject(ProcessDetailStore);

  protected chartSize = [1100, 400];
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

  protected readonly chartData = this.processDetailStore.chartData;
  protected readonly tableData = this.processDetailStore.tableData;
  protected readonly tablePaging = this.processDetailStore.paging;
  protected readonly machineSelectBoxData =
    this.processDetailStore.machineSelectBox;

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

  ngOnInit(): void {
    this.store.dispatch(getProcessDetailDataSelectBoxes());
    this.store.dispatch(getProcessDetailData({ payload: this.request }));
  }

  protected requestNewPage(pageNumber: number): void {
    this.request = {
      ...this.request,
      Paging: {
        ...this.request.Paging,
        CurrentIndex: pageNumber - 1,
      },
    };
    this.store.dispatch(getProcessDetailData({ payload: this.request }));
  }

  protected filtersOptions(filters: any): void {
    this.request = {
      ...this.request,
      Filters: { ...filters },
    };
    this.store.dispatch(getProcessDetailData({ payload: this.request }));
  }
}
