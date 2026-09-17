import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { IOeeMachiningService } from "../../../api/services/interfaces/core/data-warehouse/ioee.service";
import { IMachineService } from "../../../api/services/interfaces/core/imachine.service";
import { IProductService } from "../../../api/services/interfaces/core/iproduct.service";
import {
  getOeeData,
  getOeeDataSelectBoxes,
  getOeeDataSelectBoxesSuccess,
  getOeeDataSuccess,
  oeeFailure,
} from "../actions/oee.actions";
import { OeeEffects } from "./oee.effects";

describe("OeeEffects", () => {
  let actions$: Subject<Action>;
  let effects: OeeEffects;
  let oeeService: jasmine.SpyObj<IOeeMachiningService>;
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
    oeeService = jasmine.createSpyObj<IOeeMachiningService>(
      "IOeeMachiningService",
      ["GetOeeData"]
    );
    machineService = jasmine.createSpyObj<IMachineService>("IMachineService", [
      "GetMachines",
    ]);
    productService = jasmine.createSpyObj<IProductService>("IProductService", [
      "GetProductsList",
    ]);

    TestBed.configureTestingModule({
      providers: [
        OeeEffects,
        provideMockActions(() => actions$),
        { provide: IMachineService, useValue: machineService },
        { provide: IProductService, useValue: productService },
        { provide: IOeeMachiningService, useValue: oeeService },
        {
          provide: Store,
          useValue: jasmine.createSpyObj<Store>("Store", ["dispatch"]),
        },
      ],
    });

    effects = TestBed.inject(OeeEffects);
  });

  it("requests and converts OEE data", async () => {
    oeeService.GetOeeData.and.returnValue(
      of({
        ChartData: [
          { Name: "Series", Series: [{ Name: "Value", Value: 1.5 }] },
        ],
        TableData: {
          Result: [
            { Name: "Product", Availability: 1, Production: 2, Quality: 3 },
          ],
          Total: 1,
        },
      } as any)
    );
    const resultPromise = firstValueFrom(effects.getOeeData$);
    actions$.next(getOeeData({ payload: request }));
    const result = await resultPromise;

    expect(result.type).toBe(getOeeDataSuccess.type);
    expect(result.payload.Chart).toEqual([
      { name: "Series", series: [{ name: "Value", value: 1.5 }] },
    ]);
    expect(result.payload.Table.Information).toEqual([
      { Product: "Product", Availability: 1, Production: 2, Quality: 3 },
    ]);
    expect(result.payload.Table.Total).toBe(1);
    expect(oeeService.GetOeeData).toHaveBeenCalledWith(
      jasmine.objectContaining({ Paging: request.Paging })
    );
  });

  it("loads and converts machine and product select boxes", async () => {
    machineService.GetMachines.and.returnValue(
      of([{ Id: 1, Name: "Machine" }] as any)
    );
    productService.GetProductsList.and.returnValue(
      of([{ Id: 2, Name: "Product" }] as any)
    );

    const resultPromise = firstValueFrom(effects.getOeeDataSelectBox$);
    actions$.next(getOeeDataSelectBoxes({}));

    expect(await resultPromise).toEqual(
      getOeeDataSelectBoxesSuccess({
        payload: [
          [{ name: "Machine", value: 1, selected: false }],
          [{ name: "Product", value: 2, selected: false }],
        ],
      })
    );
  });

  it("maps select-box errors to oeeFailure", async () => {
    const error = new Error("products failed");
    machineService.GetMachines.and.returnValue(of([]));
    productService.GetProductsList.and.returnValue(throwError(() => error));

    const resultPromise = firstValueFrom(effects.getOeeDataSelectBox$);
    actions$.next(getOeeDataSelectBoxes({}));

    expect(await resultPromise).toEqual(oeeFailure({ payload: error }));
  });
});
