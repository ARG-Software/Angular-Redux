import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  TemplateRef,
} from "@angular/core";
import { MimsUiUtilsService } from "../../../mims-ui.utils.service";

@Component({
  standalone: false,
  selector: "mims-stacked-horizontal-bar-chart",
  styleUrls: ["stacked-horizontal-bar-chart.component.css"],
  templateUrl: "stacked-horizontal-bar-chart.component.html",
})
export class StackedHorizontalBarChartComponent implements OnChanges {
  public hasContent = false;

  public view: [number, number] = [400, 400];
  @Input() public data: any[];
  @Input() public showXAxis = true;
  @Input() public showYAxis = true;
  @Input() public showLegend = false;
  @Input() public showXAxisLabel = false;
  @Input() public xAxisLabel = "";
  @Input() public showYAxisLabel = false;
  @Input() public yAxisLabel = "";
  @Input() public timeline = false;
  @Input() public tooltipTemplate: TemplateRef<any>;
  @Input() public startDate = new Date(0, 0, 0, 0);

  public constructor(private mimsUIUtilServices: MimsUiUtilsService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.mimsUIUtilServices.verifyIfIncomeInputIsValid(changes["data"])) {
      this.hasContent = true;
      this.data = changes["data"].currentValue;
    }
  }

  public xTickFormatting = (val: any) => {
    if (this.timeline) {
      const result = new Date(this.startDate.getTime() + val * 60000);
      return result.toLocaleTimeString();
    } else {
      return val.toString();
    }
  };
}
