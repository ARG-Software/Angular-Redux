import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, switchMap, map, tap, finalize } from "rxjs/operators";

import * as MimsModels from "src/app/api/models/apimodels";

import {
  getOeeData,
  getOeeDataSuccess,
  getOeeDataSelectBoxes,
  getOeeDataSelectBoxesSuccess,
  oeeFailure,
} from "../actions/oee.actions";

import {
  OeeTableDataModelUI,
  OeeDataModelUI,
  OeeChartDataModelUI,
  OeeTableInformationModelUI,
} from "../models/oee.models";

import * as fromMain from "../../../main/main.reducers.index";
import * as loadingActions from "../../../main/actions/loading.actions";
import { forkJoin, of } from "rxjs";
import { IOeeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/ioee.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";
import { convertApiDataToSelectBoxes } from "src/app/utils/funtion.utils";

@Injectable()
export class OeeEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  constructor(
    private oeeService: IOeeMachiningService,
    private machineService: IMachineService,
    private productService: IProductService
  ) {}

  public getOeeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOeeData),
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
        this.oeeService.GetOeeData(payload).pipe(
          map((response: MimsModels.IOEEScreenDto) => {
            const oeeData: OeeDataModelUI = {
              Chart: convertApiDataToChartData(response.ChartData),
              Table: convertApiDataToTableData(response.TableData),
            };

            return getOeeDataSuccess({ payload: oeeData });
          }),
          finalize(() =>
            this.mainStore$.dispatch(loadingActions.hideLoading())
          ),
          catchError((error) => of(oeeFailure({ payload: error })))
        )
      )
    )
  );

  public getOeeDataSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOeeDataSelectBoxes),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(() =>
        forkJoin({
          machines: this.machineService.GetMachines(),
          products: this.productService.GetProductsList(),
        }).pipe(
          map(({ machines, products }) => {
            return getOeeDataSelectBoxesSuccess({
              payload: convertApiDataToSelectBoxes([machines, products]),
            });
          }),
          finalize(() =>
            this.mainStore$.dispatch(loadingActions.hideLoading())
          ),
          catchError((error) => of(oeeFailure({ payload: error })))
        )
      )
    )
  );

  public getOeeDataSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(getOeeDataSuccess)),
    { dispatch: false }
  );

  public getOeeDataSelectBoxSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(getOeeDataSelectBoxesSuccess)),
    { dispatch: false }
  );

  public oeeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(oeeFailure),
        tap((error) => {
          console.log("Error:", error);
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
