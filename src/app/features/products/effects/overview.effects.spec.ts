import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { IDownTimeRecordService } from "../../../api/services/interfaces/core/idowntimerecord.service";
import { IMachineOperationService } from "../../../api/services/interfaces/core/imachineoperation.service";
import {
  getDownTimeChart,
  getDownTimeChartSuccess,
  getMachineOperationTable,
  getMachineOperationTableSuccess,
  overviewFailure,
} from "../actions/overview.actions";
import { OverviewEffects } from "./overview.effects";

describe("OverviewEffects", () => {
  let actions$: Subject<Action>;
  let effects: OverviewEffects;
  let machineService: jasmine.SpyObj<IMachineOperationService>;
  let downtimeService: jasmine.SpyObj<IDownTimeRecordService>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    machineService = jasmine.createSpyObj<IMachineOperationService>(
      "IMachineOperationService",
      ["GetMachineOperationsofProduct"]
    );
    downtimeService = jasmine.createSpyObj<IDownTimeRecordService>(
      "IDownTimeRecordService",
      ["getDowntimeOfProductShiftGraphic"]
    );

    TestBed.configureTestingModule({
      providers: [
        OverviewEffects,
        provideMockActions(() => actions$),
        { provide: IMachineOperationService, useValue: machineService },
        { provide: IDownTimeRecordService, useValue: downtimeService },
        {
          provide: Store,
          useValue: jasmine.createSpyObj<Store>("Store", ["dispatch"]),
        },
      ],
    });

    effects = TestBed.inject(OverviewEffects);
  });

  it("loads machine operation table data", async () => {
    const data = [
      {
        Id: 1,
        MachineName: "Machine",
        OperationName: "Cut",
        MachineId: 2,
        OperationId: 3,
        AssetNumber: 4,
        OEE: 80,
        MDE: 90,
      },
    ];
    machineService.GetMachineOperationsofProduct.and.returnValue(of(data));

    const resultPromise = firstValueFrom(effects.getMachineOperationTable$);
    actions$.next(
      getMachineOperationTable({ payload: { productId: 5 } as any })
    );

    expect(await resultPromise).toEqual(
      getMachineOperationTableSuccess({ payload: data })
    );
    expect(machineService.GetMachineOperationsofProduct).toHaveBeenCalledWith(5);
  });

  it("loads downtime chart data", async () => {
    const startDate = new Date("2025-01-01");
    const data = [{ Name: "Shift", Uptime: 0.8, Downtime: 0.2 }];
    downtimeService.getDowntimeOfProductShiftGraphic.and.returnValue(of(data));

    const resultPromise = firstValueFrom(effects.getDownTimeStatisticChart$);
    actions$.next(
      getDownTimeChart({ payload: { productId: 5, startDate } as any })
    );

    expect(await resultPromise).toEqual(getDownTimeChartSuccess({ payload: data }));
    expect(
      downtimeService.getDowntimeOfProductShiftGraphic
    ).toHaveBeenCalledWith(5, startDate);
  });

  it("maps service errors to overviewFailure", async () => {
    const error = new Error("load failed");
    machineService.GetMachineOperationsofProduct.and.returnValue(
      throwError(() => error)
    );

    const resultPromise = firstValueFrom(effects.getMachineOperationTable$);
    actions$.next(
      getMachineOperationTable({ payload: { productId: 5 } as any })
    );

    expect(await resultPromise).toEqual(overviewFailure({ payload: error }));
  });
});
