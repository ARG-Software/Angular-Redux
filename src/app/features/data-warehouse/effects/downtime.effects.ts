import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, switchMap, map, tap, finalize } from "rxjs/operators";

import * as MimsModels from "src/app/api/models/apimodels";

import * as fromMain from "../../../main/main.reducers.index";
import * as loadingActions from "../../../main/actions/loading.actions";

import * as DowntimeModelsUI from "../models/downtime.models";

import { forkJoin, of } from "rxjs";
import { IDownTimeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/idowntime.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";
import {
  downtimeFailure,
  getDowntimeData,
  getDowntimeDataSelectBoxes,
  getDowntimeDataSelectBoxesSuccess,
  getDowntimeDataSuccess,
} from "../actions/downtime.actions";
import { convertApiDataToSelectBoxes } from "src/app/utils/funtion.utils";

@Injectable()
export class DowntimeEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  constructor(
    private downtimeService: IDownTimeMachiningService,
    private machineService: IMachineService,
    private productService: IProductService
  ) {}

  public getDowntimeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDowntimeData),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      map((action) => {
        const request: MimsModels.DWMachiningDowntimeScreenRequestDto = {
          DWMachiningFilterDto: {
            StartDate: new Date(action.payload.Filters.StartDate),
            EndDate: new Date(action.payload.Filters.EndDate),
            MachineId: action.payload.Filters.MachineId,
            ProductId: action.payload.Filters.ProductId,
          },
          Paging: action.payload.Paging,
        };

        return request;
      }),
      switchMap((payload) =>
        this.downtimeService.GetDownTimeData(payload).pipe(
          map((response: MimsModels.IMachineDowntimeScreenDto) => {
            const downtimeData: DowntimeModelsUI.DowntimeDataModelUI = {
              Chart: converApiDataToChartData(response.ChartData),
              Table: convertApiDataToTableData(response.TableData),
            };
            return getDowntimeDataSuccess({ payload: downtimeData });
          }),
          finalize(() =>
            this.mainStore$.dispatch(loadingActions.hideLoading())
          ),
          catchError((error) => {
            return of(downtimeFailure({ payload: error }));
          })
        )
      )
    )
  );

  public getDowntimeDataSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDowntimeDataSelectBoxes),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(() =>
        forkJoin({
          machines: this.machineService.GetMachines(),
          products: this.productService.GetProductsList(),
        }).pipe(
          map(({ machines, products }) =>
            getDowntimeDataSelectBoxesSuccess({
              payload: convertApiDataToSelectBoxes([machines, products]),
            })
          ),
          finalize(() =>
            this.mainStore$.dispatch(loadingActions.hideLoading())
          ),
          catchError((error) => of(downtimeFailure({ payload: error })))
        )
      )
    )
  );

  public downtimeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downtimeFailure),
        tap(({ payload }) => {
          console.log("Error:", payload);
        })
      ),
    { dispatch: false }
  );

  public getDowntimeDataSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(getDowntimeDataSuccess)),
    { dispatch: false }
  );

  public getDowntimeDataSelectBoxSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(getDowntimeDataSelectBoxesSuccess)),
    { dispatch: false }
  );
}

/**
 * manipulate api data to be readable by combo chart
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by combo chart
 */
export function converApiDataToChartData(
  data: MimsModels.IDowntimeMachineParetoDto[]
): DowntimeModelsUI.ComboChartDataModelUI {
  let chartData: DowntimeModelsUI.ComboChartDataModelUI;

  const lineName: string = data.length > 0 ? Object.keys(data[0])[2] : "";
  const barData: DowntimeModelsUI.ComboBarChartDataModelUI[] = [];
  const lineSeries: any[] = [];

  data.forEach((elem: MimsModels.IDowntimeMachineParetoDto) => {
    barData.push({
      name: elem.AssetNumber,
      value: elem.DowntimeInMinutes,
    });
    lineSeries.push({
      name: elem.AssetNumber,
      value: elem.InstancesOfDowntime,
    });
  });

  chartData = {
    Bar: barData,
    Line: [
      {
        name: lineName,
        series: lineSeries,
      },
    ],
  };

  return chartData;
}

/**
 * Manipulate api data to be readable by table
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by table
 */
export function convertApiDataToTableData(
  data: MimsModels.IPagedSet<MimsModels.IDowntimeMachineParetoDto>
): DowntimeModelsUI.DowntimeTableInformationModelUI {
  const tableData: DowntimeModelsUI.DowntimeTableDataModelUI[] = [];

  data.Result.forEach((elem) => {
    tableData.push({
      Machine: elem.AssetNumber,
      Downtime: elem.DowntimeInMinutes,
      Instances: elem.InstancesOfDowntime,
    });
  });

  return {
    Information: tableData,
    Total: data.Total,
  };
}
