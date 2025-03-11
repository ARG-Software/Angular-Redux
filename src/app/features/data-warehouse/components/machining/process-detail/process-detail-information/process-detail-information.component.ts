import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  ProcessDetailChartModelUI,
  ProcessDetailTableModelUI,
} from "../../../../models/process-detail.models";
import { PagingModelUI } from "src/app/app.models";

@Component({
  standalone: false,
  selector: "process-detail-information",
  templateUrl: "./process-detail-information.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessDetailInformationComponent {
  @Input() public chartData: ProcessDetailChartModelUI[];
  @Input() public tableData: ProcessDetailTableModelUI[];
  @Input() public chartSize: any;
  @Input() public tableHeaders: any;
  @Input() public columnNames: any;
  @Input() public paginationDetails: PagingModelUI;

  @Output() protected changePage: EventEmitter<number> = new EventEmitter();

  protected startDate = new Date("2018-11-08T00:00:00");

  public changePagination(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }
}
