import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { Store } from "@ngrx/store";
import {
  getDownTimeChart,
  getMachineOperationTable,
} from "../../actions/overview.actions";
import {
  DownTimeStatisticsChartRequestModel,
  MachineOperationsRequestModel,
} from "../../models/overview.models";
import { OverviewStore } from "../../stores/overview.store";

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

  public readonly chartData = inject(OverviewStore).downTimeRecordChartData;
  public readonly tableData = inject(OverviewStore).machineOperationTableData;
  public readonly columnNames =
    inject(OverviewStore).machineOperationTableColumns;
  public readonly headerNames =
    inject(OverviewStore).machineOperationsTableHeaderName;

  private readonly store = inject(Store);
  private readonly date = new Date();

  public ngOnInit(): void {
    const requestChartModel: DownTimeStatisticsChartRequestModel = {
      productId: 1,
      startDate: this.date,
    };

    const requestTableModel: MachineOperationsRequestModel = {
      productId: 1,
    };

    this.store.dispatch(getDownTimeChart({ payload: requestChartModel }));
    this.store.dispatch(
      getMachineOperationTable({ payload: requestTableModel })
    );
  }
}
