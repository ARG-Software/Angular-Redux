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
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";

@Component({
  standalone: false,
  selector: "downtime-information",
  templateUrl: "./downtime-information.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DowntimeInformationComponent {
  @Output() public changePage: EventEmitter<number> = new EventEmitter();

  @Input() public chartData: ComboChartDataModelUI;
  @Input() public tableData: DowntimeTableDataModelUI[];
  @Input() public chartColors: any;
  @Input() public chartSize: any;
  @Input() public tableHeaders: any;
  @Input() public paginationDetails: PagingModelUI;

  public changePagination(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }

  get formattedTableData(): DataGridCellModel[] {
    return (
      this.tableData?.flatMap((item) => [
        { value: item.Machine },
        { value: item.Downtime },
        { value: item.Instances },
      ]) ?? []
    );
  }
}
