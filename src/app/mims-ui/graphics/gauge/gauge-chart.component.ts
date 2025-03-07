import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
} from "@angular/core";
import { MimsUiUtilsService } from "../../mims-ui.utils.service";

@Component({
  standalone: false,
  selector: "mims-gauge-chart",
  templateUrl: "./gauge-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeChartComponent implements OnChanges {
  public hasContent = false;

  @Input() public gaugeData: any;

  public valueFormatting: any;

  public constructor(private mimsUIUtilServices: MimsUiUtilsService) {
    this.labelEmpty();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // TODO: commented to test, uncommment when finished
    // if (this.mimsUIUtilServices.verifyIfIncomeInputIsValid(changes.data)) {
    //     this.hasContent = true;
    //     this.results = changes.data.currentValue;
    // }
  }

  /**
   * Action to set default chart label to empty
   */
  public labelEmpty(): void {
    this.valueFormatting = () => "";
  }
}
