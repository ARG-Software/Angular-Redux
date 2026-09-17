import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { IProcessDetailMachiningService } from "../../../api/services/interfaces/core/data-warehouse/iprocess-detail.service";
import { IMachineService } from "../../../api/services/interfaces/core/imachine.service";
import {
  getProcessDetailData,
  getProcessDetailDataSelectBoxes,
  getProcessDetailDataSelectBoxesSuccess,
  getProcessDetailDataSuccess,
  processDetailFailure,
} from "../actions/process-detail.actions";
import { ProcessDetailEffects } from "./process-detail.effects";

describe("ProcessDetailEffects", () => {
  let actions$: Subject<Action>;
  let effects: ProcessDetailEffects;
  let processDetailService: jasmine.SpyObj<IProcessDetailMachiningService>;
  let machineService: jasmine.SpyObj<IMachineService>;

  const request = {
    Filters: {
      MachineId: 1,
      ProductId: 2,
      StartDate: "2025-01-01T00:00:00Z",
      EndDate: "2025-01-02T00:00:00Z",
    },
    Paging: { CurrentIndex: 0, HowManyPerPage: 10 },
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    processDetailService =
      jasmine.createSpyObj<IProcessDetailMachiningService>(
        "IProcessDetailMachiningService",
        ["GetProcessDetailData"]
      );
    machineService = jasmine.createSpyObj<IMachineService>("IMachineService", [
      "GetMachines",
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProcessDetailEffects,
        provideMockActions(() => actions$),
        { provide: IMachineService, useValue: machineService },
        {
          provide: IProcessDetailMachiningService,
          useValue: processDetailService,
        },
        {
          provide: Store,
          useValue: jasmine.createSpyObj<Store>("Store", ["dispatch"]),
        },
      ],
    });

    effects = TestBed.inject(ProcessDetailEffects);
  });

  it("requests and converts process-detail data", async () => {
    processDetailService.GetProcessDetailData.and.returnValue(
      of([
        {
          MachineState: "Running",
          Reason: "",
          Duration: 60,
          StartTime: "2025-01-01T00:00:00Z",
          EndTime: "2025-01-01T01:00:00Z",
        },
      ])
    );
    const resultPromise = firstValueFrom(effects.getProcessDetailData$);
    actions$.next(getProcessDetailData({ payload: request }));
    const result = await resultPromise;

    expect(result.type).toBe(getProcessDetailDataSuccess.type);
    expect(result.payload.Chart[0].series).toEqual([
      jasmine.objectContaining({
        name: "2025-01-01T01:00:00.000Z",
        value: 60,
      }),
    ]);
    expect(result.payload.Table.Information).toEqual([
      jasmine.objectContaining({ MachineState: "Running", Duration: 60 }),
    ]);
    expect(result.payload.Table.Total).toBe(1);
    expect(processDetailService.GetProcessDetailData).toHaveBeenCalledWith(
      request
    );
  });

  it("loads and converts machine select-box data", async () => {
    machineService.GetMachines.and.returnValue(
      of([{ Id: 1, Name: "Machine" }] as any)
    );

    const resultPromise = firstValueFrom(
      effects.getProcessDetailDataSelectBox$
    );
    actions$.next(getProcessDetailDataSelectBoxes({}));

    expect(await resultPromise).toEqual(
      getProcessDetailDataSelectBoxesSuccess({
        payload: [{ name: "Machine", value: 1, selected: false }],
      })
    );
  });

  it("maps machine select-box errors to processDetailFailure", async () => {
    const error = new Error("machines failed");
    machineService.GetMachines.and.returnValue(throwError(() => error));

    const resultPromise = firstValueFrom(
      effects.getProcessDetailDataSelectBox$
    );
    actions$.next(getProcessDetailDataSelectBoxes({}));

    expect(await resultPromise).toEqual(
      processDetailFailure({ payload: error })
    );
  });
});
