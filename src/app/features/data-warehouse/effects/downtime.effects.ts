import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, switchMap, map, tap, finalize } from "rxjs/operators";

import * as MimsModels from "src/app/api/models/apimodels";

import * as fromMain from "../../../main/main.reducers.index";
import * as loadingActions from "../../../main/actions/loading.actions";

import {
  GetDowntimeData,
  GetDowntimeDataSuccess,
  DowntimeFailure,
  DowntimeActionTypes,
  GetDowntimeDataSelectBoxes,
  GetDowntimeDataSelectBoxesSuccess,
} from "../actions/downtime.actions";

import * as DowntimeModelsUI from "../models/downtime.models";

import { forkJoin, of } from "rxjs";
import { IDownTimeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/idowntime.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";

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
      ofType<GetDowntimeData>(DowntimeActionTypes.GetDowntimeData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
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

            return new GetDowntimeDataSuccess(downtimeData);
          }),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => {
            return of(new DowntimeFailure(error));
          })
        )
      )
    )
  );

  public getDowntimeDataSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetDowntimeDataSelectBoxes>(
        DowntimeActionTypes.GetDowntimeDataSelectBoxes
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        forkJoin({
          machines: this.machineService.GetMachines(),
          products: this.productService.GetProductsList(),
        }).pipe(
          map(({ machines, products }) => {
            return new GetDowntimeDataSelectBoxesSuccess(
              convertApiDataToSelectBoxes([machines, products])
            );
          }),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => {
            return of(new DowntimeFailure(error));
          })
        )
      )
    )
  );

  public downtimeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<DowntimeFailure>(DowntimeActionTypes.DowntimeFailure),
        tap((error) => {
          console.log("Error:", error);
        })
      ),
    { dispatch: false }
  );

  public getDowntimeDataSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetDowntimeDataSuccess>(
          DowntimeActionTypes.GetDowntimeDataSuccess
        )
      ),
    { dispatch: false }
  );

  public getDowntimeDataSelectBoxSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetDowntimeDataSelectBoxesSuccess>(
          DowntimeActionTypes.GetDowntimeDataSelectBoxesSuccess
        )
      ),
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

export function convertApiDataToSelectBoxes(data: any[]): any[] {
  return data.map((arrayForSelectBox) =>
    arrayForSelectBox.map((elem: any) => ({
      name: elem.Name,
      value: elem.Id,
      selected: false,
    }))
  );
}
