import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { OeeStore } from "../../../stores/oee.store";
import { MachiningRequestModelUI } from "../../../models/downtime.models";
import { getTodayDateMinusInputDays } from "src/app/utils/funtion.utils";
import {
  getOeeData,
  getOeeDataSelectBoxes,
} from "../../../actions/oee.actions";

@Component({
  standalone: false,
  selector: "oee",
  templateUrl: "./oee.component.html",
  styleUrls: ["./oee.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OeeComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly oeeStore = inject(OeeStore);

  public readonly chartData = this.oeeStore.oeeChartData;
  public readonly tableData = this.oeeStore.oeeTableData;
  public readonly tablePaging = this.oeeStore.currentPaging;
  public readonly machineSelectBoxData = this.oeeStore.machineSelectBox;
  public readonly productSelectBoxData = this.oeeStore.productSelectBox;

  public readonly tableHeaders = [
    "Product",
    "Availability",
    "Production",
    "Quality",
  ];
  public readonly chartSize = [1100, 400];

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

  ngOnInit(): void {
    this.store.dispatch(getOeeDataSelectBoxes());
    this.store.dispatch(getOeeData({ payload: this.request }));
  }

  public requestNewPage(pageNumber: number): void {
    this.request.Paging.CurrentIndex = pageNumber - 1;
    this.store.dispatch(getOeeData({ payload: this.request }));
  }

  public filtersOptions(filters: any): void {
    this.request = {
      ...this.request,
      Filters: { ...filters },
    };
    this.store.dispatch(getOeeData({ payload: this.request }));
  }
}
