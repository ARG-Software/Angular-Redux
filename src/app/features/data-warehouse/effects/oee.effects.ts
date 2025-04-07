import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, switchMap, map, tap, finalize } from "rxjs/operators";

import * as MimsModels from "src/app/api/models/apimodels";

import {
  getOeeData,
  getOeeDataSelectBoxes,
  oeeFailure,
} from "../actions/oee.actions";

import {
  OeeTableDataModelUI,
  OeeChartDataModelUI,
  OeeTableInformationModelUI,
} from "../models/oee.models";

import * as fromMain from "../../../main/main.reducers.index";
import * as loadingActions from "../../../main/actions/loading.actions";
import { forkJoin, of } from "rxjs";
import { IOeeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/ioee.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";
import { OeeStore } from "../stores/oee.store";

@Injectable()
export class OeeEffects {
  private readonly actions$ = inject(Actions);
  private readonly mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private readonly oeeStore = inject(OeeStore);

  constructor(
    private oeeService: IOeeMachiningService,
    private machineService: IMachineService,
    private productService: IProductService
  ) {}

  getOeeData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getOeeData),
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
          //TODO Replace this with: this.oeeService.GetOeeData(request)
          of({
            ChartData: [
              {
                Name: "Series",
                Series: [
                  { Name: "Value One", Value: 1.5 },
                  { Name: "Value two", Value: 3 },
                  { Name: "Value three", Value: 5 },
                ],
              },
              {
                Name: "Series 2",
                Series: [
                  { Name: "Value One", Value: 1 },
                  { Name: "Value two", Value: 4 },
                  { Name: "Value three", Value: 2 },
                ],
              },
            ],
            TableData: {
              Result: [
                {
                  Name: "Product A",
                  Availability: 95,
                  Production: 90,
                  Quality: 92,
                },
                {
                  Name: "Product B",
                  Availability: 85,
                  Production: 88,
                  Quality: 91,
                },
              ],
              Total: 2,
            },
          }).pipe(
            tap((response) => {
              const table = convertApiDataToTableData(response.TableData);

              this.oeeStore.setOeeData(
                convertApiDataToChartData(response.ChartData),
                table.Information,
                { ...originalPaging, Total: table.Total }
              );
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(oeeFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  getOeeSelectBoxes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getOeeDataSelectBoxes),
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

              this.oeeStore.setSelectBoxes(machineSelectBox, productSelectBox);
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(oeeFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  oeeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(oeeFailure),
        tap(({ payload }) => {
          console.error("OEE Error:", payload);
        })
      ),
    { dispatch: false }
  );
}

/**
 * Manipulate api data to be readable by table
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by table
 */
export function convertApiDataToTableData(
  data: MimsModels.IPagedSet<MimsModels.IOEETableDto>
): OeeTableInformationModelUI {
  const rowsData: OeeTableDataModelUI[] = [];

  data.Result.forEach((elem) => {
    rowsData.push({
      Product: elem.Name,
      Availability: elem.Availability,
      Production: elem.Production,
      Quality: elem.Quality,
    });
  });

  return {
    Information: rowsData,
    Total: data.Total,
  };
}

/**
 * Manipulate api data to be readable by chart
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by chart
 */
export function convertApiDataToChartData(
  data: MimsModels.IOEEChartDto[]
): OeeChartDataModelUI[] {
  return data.map((elem) => ({
    name: elem.Name,
    series: elem.Series.map((serie) => ({
      name: serie.Name,
      value: serie.Value,
    })),
  }));
}
