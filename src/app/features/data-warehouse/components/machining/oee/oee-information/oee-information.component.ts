import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  OeeTableDataModelUI,
  OeeChartDataModelUI,
} from "../../../../models/oee.models";
import { PagingModelUI } from "src/app/app.models";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";

@Component({
  standalone: false,
  selector: "oee-information",
  templateUrl: "./oee-information.component.html",
  styleUrls: ["./oee-information.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OeeInformationComponent {
  @Input() public chartData: OeeChartDataModelUI[];
  @Input() public tableData: OeeTableDataModelUI[];
  @Input() public paginationDetails: PagingModelUI;
  @Input() public chartSize: any;
  @Input() public tableHeaders: any;

  @Output() private changePage: EventEmitter<number> = new EventEmitter();

  public changePagination(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }

  public get formattedTableData(): DataGridCellModel[] {
    return (
      this.tableData?.map((row) => ({
        value: row.Product,
        availability: row.Availability.toString(),
        production: row.Production.toString(),
        quality: row.Quality.toString(),
      })) ?? []
    );
  }
}
