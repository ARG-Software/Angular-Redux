import {
  downtimeFailure,
  getDowntimeData,
  getDowntimeDataSelectBoxesSuccess,
  getDowntimeDataSuccess,
} from "../actions/downtime.actions";
import { initialState, downtimeReducer } from "./downtime.reducer";

describe("Downtime Reducer", () => {
  const request = {
    Filters: {
      MachineId: 1,
      ProductId: 2,
      StartDate: "2025-01-01",
      EndDate: "2025-01-02",
    },
    Paging: { CurrentIndex: 3, HowManyPerPage: 10 },
  };
  const machines = [{ name: "Machine A", value: 1, selected: false }];
  const products = [{ name: "Product A", value: 2, selected: false }];

  it("returns the initial state for an unknown action", () => {
    expect(downtimeReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("stores machine and product select-box options", () => {
    const result = downtimeReducer(
      initialState,
      getDowntimeDataSelectBoxesSuccess({ payload: [machines, products] })
    );

    expect(result.machineSelectBox).toEqual(machines);
    expect(result.productSelectBox).toEqual(products);
  });

  it("tracks requested paging and applies it after data loads", () => {
    const requested = downtimeReducer(
      initialState,
      getDowntimeData({ payload: request })
    );
    const payload = {
      Chart: { Bar: [{ name: "M1", value: 10 }], Line: [] },
      Table: {
        Information: [{ Machine: "M1", Downtime: 10, Instances: 2 }],
        Total: 1,
      },
    };
    const loaded = downtimeReducer(
      requested,
      getDowntimeDataSuccess({ payload })
    );

    expect(requested.downtimeTableData.RequestedPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.downtimeTableData.Information).toEqual(
      payload.Table.Information
    );
    expect(loaded.downtimeTableData.CurrentPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.downtimeTableData.RequestedPaging).toBeNull();
    expect(loaded.downtimeChartData).toEqual(payload.Chart);
  });

  it("clears requested paging after a failure", () => {
    const pending = downtimeReducer(
      initialState,
      getDowntimeData({ payload: request })
    );

    expect(
      downtimeReducer(pending, downtimeFailure({ payload: "failed" }))
        .downtimeTableData.RequestedPaging
    ).toBeNull();
  });
});
