import { PaginationComponent } from "./pagination.component";

describe("PaginationComponent", () => {
  it("calculates the page count with a partial final page", () => {
    const component = new PaginationComponent();

    component.itemsPerPage = 5;
    component.numItems = 7;

    expect(component.totalPages).toBe(2);
  });

  it("clamps the current page when the result count shrinks", () => {
    const component = new PaginationComponent();
    component.itemsPerPage = 10;
    component.numItems = 100;
    component.page = 10;

    component.numItems = 12;

    expect(component.page).toBe(2);
  });

  it("emits the clamped page", () => {
    const component = new PaginationComponent();
    const emittedPages: number[] = [];
    component.numItems = 12;
    component.OnChangePage.subscribe((page) => emittedPages.push(page));

    component.changePage(20);

    expect(emittedPages).toEqual([2]);
  });
});
