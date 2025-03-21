import { Observable, startWith, map } from "rxjs";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as fromModule from "./../../products.reducers.index";
import * as Actions from "../../actions/overview.actions";
import {
  DownTimeStatisticsChartRequestModel,
  MachineOperationsRequestModel,
  DownTimeRecordChartModel,
} from "../../models/overview.models";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";

@Component({
  standalone: false,
  templateUrl: "overview.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  public cardsData = [
    {
      backgroundColour: "#fafafa",
      title: "Production graph",
      titleColour: "black",
      text: "78%",
      textColour: "black",
      topRightTitle: "January 2018",
      topRightTitleColor: "black",
      midRightTitle: "+5 631",
      midRightTitleColor: "black",
      buttonText: "Open statistic",
    },
    {
      backgroundColour: "#fafafa",
      title: "Lots at Dowa",
      titleColour: "black",
      text: "04",
      textColour: "black",
      topRightTitle: "January 2018",
      topRightTitleColor: "black",
      midRightTitle: "-119",
      midRightTitleColor: "black",
      buttonText: "Open statistic",
    },
    {
      backgroundColour: "#fafafa",
      title: "Hours per week",
      titleColour: "black",
      text: "42h",
      textColour: "black",
      topRightTitle: "January 2018",
      topRightTitleColor: "black",
      midRightTitle: "+5 631",
      midRightTitleColor: "black",
      buttonText: "Open statistic",
    },
  ];

  public gaugeData = [
    {
      view: [200, 125],
      results: [{ name: "Germany", value: 50 }],
      colorScheme: { domain: ["#ecfb3c"] },
      min: 0,
      max: 100,
      showAxis: false,
      angleSpan: 180,
      startAngle: -90,
      legend: "20-30",
    },
    {
      view: [200, 125],
      results: [{ name: "France", value: 30 }],
      colorScheme: { domain: ["#2ecc71"] },
      min: 0,
      max: 100,
      showAxis: false,
      angleSpan: 180,
      startAngle: -90,
      legend: "30-40",
    },
    {
      view: [200, 125],
      results: [{ name: "United States", value: 80 }],
      colorScheme: { domain: ["#2ecc71"] },
      min: 0,
      max: 100,
      showAxis: false,
      angleSpan: 180,
      startAngle: -90,
      legend: "50-Inspect",
    },
    {
      view: [200, 125],
      results: [{ name: "Spain", value: 60 }],
      colorScheme: { domain: ["#f44336"] },
      min: 0,
      max: 100,
      showAxis: false,
      angleSpan: 180,
      startAngle: -90,
      legend: "Inspect-Dowa",
    },
  ];

  public gaugeLabels = ["20-30", "30-40", "50-Inspect", "Inspect-Dowa"];

  public chartData$: Observable<DownTimeRecordChartModel[]>;
  public tableData$: Observable<DataGridCellModel[]>;
  public headerNames$: Observable<string[]>;
  public columnNames$: Observable<string[]>;

  private date = new Date();

  public constructor(private store: Store<fromModule.ProductState>) {
    const requestChartModel: DownTimeStatisticsChartRequestModel = {
      productId: 1,
      startDate: this.date,
    };
    const requestTableModel: MachineOperationsRequestModel = {
      productId: 1,
    };

    this.store.dispatch(new Actions.GetDownTimeChart(requestChartModel));

    this.store.dispatch(
      new Actions.GetMachineOperationTable(requestTableModel)
    );

    this.chartData$ = this.store.pipe(
      select(fromModule.getDownTimeRecordChart),
      map((data) => data ?? [])
    );

    this.tableData$ = this.store.pipe(
      select(fromModule.getMachineOperationTableData),
      startWith([])
    );

    this.headerNames$ = this.store.pipe(
      select(fromModule.getMachineOperationsTableHeaderName),
      map((data) => data ?? [])
    );

    this.columnNames$ = this.store.pipe(
      select(fromModule.getMachineOperationTableColumns),
      map((data) => data ?? [])
    );
  }

  public ngOnInit(): void {}
}
