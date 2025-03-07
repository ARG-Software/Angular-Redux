import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  DowntimeTableDataModelUI,
  ComboChartDataModelUI,
} from "../../../../models/downtime.models";
import { PagingModelUI } from "src/app/app.models";

@Component({
  standalone: false,
  selector: "downtime-information",
  templateUrl: "./downtime-information.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DowntimeInformationComponent {
  @Output() public changePage: EventEmitter<number> = new EventEmitter();

  @Input() protected chartData: ComboChartDataModelUI;
  @Input() protected tableData: DowntimeTableDataModelUI[];
  @Input() protected chartColors: any;
  @Input() protected chartSize: any;
  @Input() protected tableHeaders: any;
  @Input() protected paginationDetails: PagingModelUI;

  public changePagination(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }
}
