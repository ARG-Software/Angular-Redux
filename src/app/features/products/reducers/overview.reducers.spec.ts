import {
  getDownTimeChartSuccess,
  getMachineOperationTableSuccess,
  overviewFailure,
} from "../actions/overview.actions";
import { initialState, overviewReducer } from "./overview.reducers";

describe("Overview Reducer", () => {
  it("returns the initial state for an unknown action", () => {
    expect(overviewReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("converts downtime percentages into chart data", () => {
    const result = overviewReducer(
      initialState,
      getDownTimeChartSuccess({
        payload: [{ Name: "Shift A", Uptime: 0.75, Downtime: 0.25 }],
      })
    );

    expect(result.downTimeRecordChartData).toEqual([
      {
        name: "Shift A",
        series: [
          { name: "Uptime", value: 75 },
          { name: "Downtime", value: 25 },
        ],
      },
    ]);
  });

  it("stores machine operation table data", () => {
    const payload = [
      {
        Id: 1,
        MachineName: "Machine A",
        OperationName: "Cut",
        MachineId: 2,
        OperationId: 3,
        AssetNumber: 4,
        OEE: 80,
        MDE: 90,
      },
    ];

    expect(
      overviewReducer(
        initialState,
        getMachineOperationTableSuccess({ payload })
      ).machineOperationTableData
    ).toEqual(payload);
  });

  it("ignores failure actions", () => {
    expect(
      overviewReducer(initialState, overviewFailure({ payload: "failed" }))
    ).toBe(initialState);
  });
});
