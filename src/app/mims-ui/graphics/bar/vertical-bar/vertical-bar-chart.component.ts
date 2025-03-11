import {
  Input,
  Component,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MimsUiUtilsService } from "../../../mims-ui.utils.service";

@Component({
  standalone: false,
  selector: "mims-vertical-bar-chart",
  templateUrl: "./vertical-bar-chart.component.html",
  styleUrls: ["./vertical-bar-chart.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalChartBarComponent implements OnChanges {
  public hasContent = false;
  public multi: any[] = [];
  public view: [number, number] = [400, 400];

  public showXAxis = true;
  public showYAxis = true;
  public gradient = true;
  public showXAxisLabel = true;
  public xAxisLabel = "Machine";
  public showYAxisLabel = true;
  public colorScheme: any = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
    name: "custom",
    selectable: true,
    group: "Ordinal",
  };

  @Input() public data: any[] = [];

  public constructor(private mimsUIUtilServices: MimsUiUtilsService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.mimsUIUtilServices.verifyIfIncomeInputIsValid(changes["data"])) {
      this.hasContent = true;
      this.multi = changes["data"].currentValue;
    }
  }
}
