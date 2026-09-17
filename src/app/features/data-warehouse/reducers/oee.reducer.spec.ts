import {
  getOeeData,
  getOeeDataSelectBoxesSuccess,
  getOeeDataSuccess,
  oeeFailure,
} from "../actions/oee.actions";
import { initialState, oeeReducer } from "./oee.reducer";

describe("OEE Reducer", () => {
  const request = {
    Filters: {
      MachineId: 1,
      ProductId: 2,
      StartDate: "2025-01-01",
      EndDate: "2025-01-02",
    },
    Paging: { CurrentIndex: 2, HowManyPerPage: 20 },
  };
  const machines = [{ name: "Machine A", value: 1, selected: false }];
  const products = [{ name: "Product A", value: 2, selected: false }];

  it("returns the initial state for an unknown action", () => {
    expect(oeeReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("stores select-box options", () => {
    const result = oeeReducer(
      initialState,
      getOeeDataSelectBoxesSuccess({ payload: [machines, products] })
    );

    expect(result.machineSelectBox).toEqual(machines);
    expect(result.productSelectBox).toEqual(products);
  });

  it("tracks requested paging and stores returned OEE data", () => {
    const pending = oeeReducer(initialState, getOeeData({ payload: request }));
    const payload = {
      Chart: [{ name: "OEE", series: [{ name: "A", value: 95 }] }],
      Table: {
        Information: [
          { Product: "A", Availability: 1, Production: 2, Quality: 3 },
        ],
        Total: 1,
      },
    };
    const loaded = oeeReducer(pending, getOeeDataSuccess({ payload }));

    expect(pending.oeeTableData.RequestedPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.oeeTableData.Information).toEqual(payload.Table.Information);
    expect(loaded.oeeTableData.CurrentPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.oeeTableData.RequestedPaging).toBeNull();
    expect(loaded.oeeChartData).toEqual(payload.Chart);
  });

  it("clears requested paging after a failure", () => {
    const pending = oeeReducer(initialState, getOeeData({ payload: request }));

    expect(
      oeeReducer(pending, oeeFailure({ payload: "failed" })).oeeTableData
        .RequestedPaging
    ).toBeNull();
  });
});
