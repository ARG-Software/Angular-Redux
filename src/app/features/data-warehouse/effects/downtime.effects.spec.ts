import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { IDownTimeMachiningService } from "../../../api/services/interfaces/core/data-warehouse/idowntime.service";
import { IMachineService } from "../../../api/services/interfaces/core/imachine.service";
import { IProductService } from "../../../api/services/interfaces/core/iproduct.service";
import {
  downtimeFailure,
  getDowntimeData,
  getDowntimeDataSelectBoxes,
  getDowntimeDataSelectBoxesSuccess,
  getDowntimeDataSuccess,
} from "../actions/downtime.actions";
import {
  converApiDataToChartData,
  convertApiDataToTableData,
  DowntimeEffects,
} from "./downtime.effects";

describe("DowntimeEffects", () => {
  let actions$: Subject<Action>;
  let effects: DowntimeEffects;
  let downtimeService: jasmine.SpyObj<IDownTimeMachiningService>;
  let machineService: jasmine.SpyObj<IMachineService>;
  let productService: jasmine.SpyObj<IProductService>;

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
    downtimeService = jasmine.createSpyObj<IDownTimeMachiningService>(
      "IDownTimeMachiningService",
      ["GetDownTimeData"]
    );
    machineService = jasmine.createSpyObj<IMachineService>("IMachineService", [
      "GetMachines",
    ]);
    productService = jasmine.createSpyObj<IProductService>("IProductService", [
      "GetProductsList",
    ]);

    TestBed.configureTestingModule({
      providers: [
        DowntimeEffects,
        provideMockActions(() => actions$),
        { provide: IDownTimeMachiningService, useValue: downtimeService },
        { provide: IMachineService, useValue: machineService },
        { provide: IProductService, useValue: productService },
        {
          provide: Store,
          useValue: jasmine.createSpyObj<Store>("Store", ["dispatch"]),
        },
      ],
    });

    effects = TestBed.inject(DowntimeEffects);
  });

  it("requests and converts downtime data", async () => {
    const chartData = [
      { AssetNumber: "M1", DowntimeInMinutes: 12, InstancesOfDowntime: 3 },
    ];
    const response = {
      ChartData: chartData,
      TableData: { Result: chartData, Total: 1 },
    };
    downtimeService.GetDownTimeData.and.returnValue(of(response as any));

    const resultPromise = firstValueFrom(effects.getDowntimeData$);
    actions$.next(getDowntimeData({ payload: request }));

    expect(await resultPromise).toEqual(
      getDowntimeDataSuccess({
        payload: {
          Chart: converApiDataToChartData(chartData as any),
          Table: convertApiDataToTableData(response.TableData as any),
        },
      })
    );
    expect(downtimeService.GetDownTimeData).toHaveBeenCalledWith(
      jasmine.objectContaining({ Paging: request.Paging })
    );
  });

  it("maps downtime request errors to downtimeFailure", async () => {
    const error = new Error("load failed");
    downtimeService.GetDownTimeData.and.returnValue(throwError(() => error));

    const resultPromise = firstValueFrom(effects.getDowntimeData$);
    actions$.next(getDowntimeData({ payload: request }));

    expect(await resultPromise).toEqual(downtimeFailure({ payload: error }));
  });

  it("loads and converts machine and product select boxes", async () => {
    machineService.GetMachines.and.returnValue(
      of([{ Id: 1, Name: "Machine" }] as any)
    );
    productService.GetProductsList.and.returnValue(
      of([{ Id: 2, Name: "Product" }] as any)
    );

    const resultPromise = firstValueFrom(effects.getDowntimeDataSelectBox$);
    actions$.next(getDowntimeDataSelectBoxes({}));

    expect(await resultPromise).toEqual(
      getDowntimeDataSelectBoxesSuccess({
        payload: [
          [{ name: "Machine", value: 1, selected: false }],
          [{ name: "Product", value: 2, selected: false }],
        ],
      })
    );
  });

  it("maps select-box errors to downtimeFailure", async () => {
    const error = new Error("machines failed");
    machineService.GetMachines.and.returnValue(throwError(() => error));
    productService.GetProductsList.and.returnValue(of([]));

    const resultPromise = firstValueFrom(effects.getDowntimeDataSelectBox$);
    actions$.next(getDowntimeDataSelectBoxes({}));

    expect(await resultPromise).toEqual(downtimeFailure({ payload: error }));
  });
});
