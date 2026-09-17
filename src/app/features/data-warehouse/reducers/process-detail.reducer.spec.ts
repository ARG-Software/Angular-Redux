import {
  getProcessDetailData,
  getProcessDetailDataSelectBoxesSuccess,
  getProcessDetailDataSuccess,
  processDetailFailure,
} from "../actions/process-detail.actions";
import {
  initialState,
  processDetailReducer,
} from "./process-detail.reducer";

describe("Process Detail Reducer", () => {
  const request = {
    Filters: {
      MachineId: 1,
      ProductId: 2,
      StartDate: "2025-01-01",
      EndDate: "2025-01-02",
    },
    Paging: { CurrentIndex: 1, HowManyPerPage: 10 },
  };

  it("returns the initial state for an unknown action", () => {
    expect(processDetailReducer(undefined, { type: "Unknown" })).toEqual(
      initialState
    );
  });

  it("stores machine select-box options", () => {
    const machines = [{ name: "Machine A", value: 1, selected: false }];

    expect(
      processDetailReducer(
        initialState,
        getProcessDetailDataSelectBoxesSuccess({ payload: machines })
      ).machineSelectBox
    ).toEqual(machines);
  });

  it("tracks requested paging and stores returned process data", () => {
    const pending = processDetailReducer(
      initialState,
      getProcessDetailData({ payload: request })
    );
    const start = new Date("2025-01-01T00:00:00Z");
    const end = new Date("2025-01-01T01:00:00Z");
    const payload = {
      Chart: [
        {
          name: "Machine A",
          series: [{ name: end, value: 60, extra: { start, end } }],
        },
      ],
      Table: {
        Information: [
          {
            Id: 1,
            MachineState: "Running",
            Reason: "",
            Duration: 60,
            StartTime: start,
            EndTime: end,
          },
        ],
        Total: 1,
      },
    };
    const loaded = processDetailReducer(
      pending,
      getProcessDetailDataSuccess({ payload })
    );

    expect(pending.processDetailTableData.RequestedPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.processDetailTableData.Information).toEqual(
      payload.Table.Information
    );
    expect(loaded.processDetailTableData.CurrentPaging).toEqual(
      jasmine.objectContaining(request.Paging)
    );
    expect(loaded.processDetailTableData.RequestedPaging).toBeNull();
    expect(loaded.processDetailChartData).toEqual(payload.Chart);
  });

  it("clears requested paging after a failure", () => {
    const pending = processDetailReducer(
      initialState,
      getProcessDetailData({ payload: request })
    );

    expect(
      processDetailReducer(
        pending,
        processDetailFailure({ payload: "failed" })
      ).processDetailTableData.RequestedPaging
    ).toBeNull();
  });
});
