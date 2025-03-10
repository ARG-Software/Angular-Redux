import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, switchMap, map, tap, finalize } from "rxjs/operators";

import * as MimsModels from "src/app/api/models/apimodels";

import {
  GetOeeData,
  GetOeeDataSuccess,
  OeeFailure,
  GetOeeDataSelectBoxes,
  GetOeeDataSelectBoxesSuccess,
  OeeActionTypes,
} from "../actions/oee.actions";

import {
  OeeTableDataModelUI,
  OeeDataModelUI,
  OeeChartDataModelUI,
  OeeTableInformationModelUI,
} from "../models/oee.models";

import * as fromMain from "../../../main/main.reducers.index";
import * as loadingActions from "../../../main/actions/loading.actions";

import { convertApiDataToSelectBoxes } from "./downtime.effects";
import { forkJoin, of } from "rxjs";
import { IOeeMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/ioee.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";

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
      ofType<GetOeeData>(OeeActionTypes.GetOeeData),
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
              { Name: "Value One", Availability: 1, Production: 1, Quality: 1 },
              { Name: "Value Two", Availability: 2, Production: 2, Quality: 2 },
            ],
            Total: 2,
          },
        }).pipe(
          // TODO: When backend is finished, uncomment service and the load tests
          // this.oeeService.GetOeeData(payload)
          map((response: MimsModels.IOEEScreenDto) => {
            const oeeData: OeeDataModelUI = {
              Chart: convertApiDataToChartData(response.ChartData),
              Table: convertApiDataToTableData(response.TableData),
            };

            return new GetOeeDataSuccess(oeeData);
          }),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => {
            return of(new OeeFailure(error));
          })
        )
      )
    )
  );

  public getOeeDataSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetOeeDataSelectBoxes>(OeeActionTypes.GetOeeDataSelectBoxes),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        forkJoin({
          machines: this.machineService.GetMachines(),
          products: this.productService.GetProductsList(),
        }).pipe(
          map(({ machines, products }) => {
            return new GetOeeDataSelectBoxesSuccess(
              convertApiDataToSelectBoxes([machines, products])
            );
          }),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => {
            return of(new OeeFailure(error));
          })
        )
      )
    )
  );

  public getOeeDataSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetOeeDataSuccess>(OeeActionTypes.GetOeeDataSuccess)
      ),
    { dispatch: false }
  );

  public getOeeDataSelectBoxSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetOeeDataSelectBoxesSuccess>(
          OeeActionTypes.GetOeeDataSelectBoxesSuccess
        )
      ),
    { dispatch: false }
  );

  public oeeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<OeeFailure>(OeeActionTypes.OeeFailure),
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
