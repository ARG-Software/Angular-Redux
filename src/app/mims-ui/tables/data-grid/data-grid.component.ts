import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from "@angular/core";
import { DataGridCellModel } from "./models/data-grid-cell.model";

@Component({
  standalone: false,
  selector: "mims-data-grid",
  templateUrl: "./data-grid.component.html",
  styleUrls: ["./data-grid.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent {
  @Output() public changePagination: EventEmitter<number> = new EventEmitter();

  @Input() public rowData: DataGridCellModel[];
  @Input() public headerName: string[];
  @Input() public columName: string[];
  @Input() public pageSize: number;
  @Input() public totalItems: number;
  @Input() public hasPagination = true;

  // tslint:disable-next-line:no-empty
  public onSelectPage(page: number) {}

  public OnChangePage(pageNumber: number) {
    this.changePagination.emit(pageNumber);
  }

  public getCellValue(data: any, column: string): any {
    return data && data[column] ? data[column].value : "";
  }
}
