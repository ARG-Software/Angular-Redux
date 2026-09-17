import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  standalone: false,
  selector: "mims-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent {
  @Input()
  public get numItems(): number {
    return this._numItems;
  }
  public set numItems(value: number) {
    if (value !== this._numItems && value >= 0) {
      this._numItems = value;

      this.buildPages();
    }
  }

  @Input()
  public get itemsPerPage(): number {
    return this._itemsPerPage;
  }
  public set itemsPerPage(value: number) {
    if (value !== this._itemsPerPage && value > 0) {
      this._itemsPerPage = value;

      this.buildPages();
    }
  }

  @Input()
  public get page(): number {
    return this._page;
  }
  public set page(value: number) {
    this.setPage(value);
  }
  public get totalPages(): number {
    return this._numberOfPages;
  }

  @Output() public OnChangePage = new EventEmitter<number>();

  private _page: number;
  private _numItems: number;
  private _itemsPerPage: number;
  private _numberOfPages: number;

  constructor() {
    this._numItems = 0;
    this._itemsPerPage = 10;
    this._page = 1;
    this._numberOfPages = 1;
  }

  public changePage(value: number): void {
    this.page = value;
    this.OnChangePage.emit(this.page);
  }

  public hasPrevious(): boolean {
    return this.page > 1;
  }

  public hasNext(): boolean {
    return this.page < this.totalPages;
  }

  public get middlePages(): number[] {
    const middlePages: number[] = [];
    if (this.page > 1) {
      middlePages.push(this.page - 1);
    }
    middlePages.push(this.page);
    if (this.page < this.totalPages) {
      middlePages.push(this.page + 1);
    }
    return middlePages;
  }

  private buildPages(): void {
    this._numberOfPages = Math.max(1, Math.ceil(this._numItems / this._itemsPerPage));
    this.setPage(this._page);
  }

  private setPage(p: number): void {
    this._page = Math.min(this.totalPages, Math.max(1, p));
  }
}
