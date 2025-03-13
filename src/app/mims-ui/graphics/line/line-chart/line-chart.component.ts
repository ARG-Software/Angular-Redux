import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  Input,
  OnInit,
} from "@angular/core";
import { MimsUiUtilsService } from "src/app/mims-ui/mims-ui.utils.service";

@Component({
  standalone: false,
  selector: "mims-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit, OnChanges {
  public multi: any[] = [];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public showYAxisLabel = true;
  public xAxisLabel: any;
  public yAxisLabel: any;
  public colorScheme: any = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
    name: "custom",
    selectable: true,
    group: "Ordinal",
  };
  public autoScale = true;
  public hasContent = false;
  @Input() public data: any[] = [];
  @Input() public xLabelName: string = "";
  @Input() public yLabelName: string = "";
  @Input() public view: [number, number] = [700, 400];

  public constructor(private mimsUIUtilServices: MimsUiUtilsService) {}

  public ngOnInit(): void {
    this.xAxisLabel =
      this.xLabelName !== null && this.xLabelName !== undefined
        ? this.xAxisLabel
        : "";
    this.yAxisLabel =
      this.yLabelName !== null && this.yLabelName !== undefined
        ? this.yLabelName
        : "";
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.mimsUIUtilServices.verifyIfIncomeInputIsValid(changes["data"])) {
      this.hasContent = true;
      this.multi = changes["data"].currentValue;
    }
  }
}
