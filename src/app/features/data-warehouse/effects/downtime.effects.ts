import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of, forkJoin } from "rxjs";

import {
  getDowntimeData,
  getDowntimeDataSelectBoxes,
  downtimeFailure,
} from "../actions/downtime.actions";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import { IDownTimeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/idowntime.service";
import { DowntimeStore } from "../stores/downtime.store";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";

import * as MimsModels from "src/app/api/models/apimodels";
import * as DowntimeModelsUI from "../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Injectable()
export class DowntimeEffects {
  private readonly actions$ = inject(Actions);
  private readonly mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private readonly downtimeStore = inject(DowntimeStore);

  constructor(
    private downtimeService: IDownTimeMachiningService,
    private machineService: IMachineService,
    private productService: IProductService
  ) {}

  getDowntimeData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getDowntimeData),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        map(({ payload }) => ({
          request: {
            DWMachiningFilterDto: {
              StartDate: new Date(payload.Filters.StartDate),
              EndDate: new Date(payload.Filters.EndDate),
              MachineId: payload.Filters.MachineId,
              ProductId: payload.Filters.ProductId,
            },
            Paging: payload.Paging,
          },
          originalPaging: payload.Paging,
        })),
        switchMap(({ request, originalPaging }) =>
          this.downtimeService.GetDownTimeData(request).pipe(
            tap((response) => {
              const table = convertApiDataToTableData(response.TableData);

              this.downtimeStore.setDowntimeData(
                converApiDataToChartData(response.ChartData),
                table.Information,
                { ...originalPaging, Total: table.Total }
              );
            }),
            finalize(() => {
              this.mainStore$.dispatch(loadingActions.hideLoading());
            }),
            catchError((error) => {
              this.mainStore$.dispatch(downtimeFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  getDowntimeDataSelectBoxes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getDowntimeDataSelectBoxes),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(() =>
          forkJoin({
            machines: this.machineService.GetMachines(),
            products: this.productService.GetProductsList(),
          }).pipe(
            tap(({ machines, products }) => {
              const machineSelectBox: MimsSelectBoxModel[] = machines.map(
                (m) => ({
                  value: m.Id,
                  name: m.Name ?? `Machine ${m.Id}`,
                  selected: false,
                })
              );

              const productSelectBox: MimsSelectBoxModel[] = products.map(
                (p) => ({
                  value: p.Id,
                  name: p.Name ?? `Product ${p.Id}`,
                  selected: false,
                })
              );

              this.downtimeStore.setSelectBoxes(
                machineSelectBox,
                productSelectBox
              );
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(downtimeFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  downtimeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downtimeFailure),
        tap(({ payload }) => {
          console.error("Downtime Error:", payload);
        })
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
