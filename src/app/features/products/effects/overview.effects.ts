import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import {
  getDownTimeChart,
  getMachineOperationTable,
  overviewFailure,
} from "../actions/overview.actions";

import { IDownTimeRecordService } from "src/app/api/services/interfaces/core/idowntimerecord.service";
import { IMachineOperationService } from "src/app/api/services/interfaces/core/imachineoperation.service";

import { OverviewStore } from "../stores/overview.store";
import { DataGridCellModel } from "src/app/mims-ui/tables/data-grid/models/data-grid-cell.model";

@Injectable()
export class OverviewEffects {
  private readonly actions$ = inject(Actions);
  private readonly mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private readonly downTimeRecordService = inject(IDownTimeRecordService);
  private readonly machineOperationService = inject(IMachineOperationService);
  private readonly overviewStore = inject(OverviewStore);

  getDownTimeStatisticChart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getDownTimeChart),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(({ payload }) =>
          this.downTimeRecordService
            .getDowntimeOfProductShiftGraphic(
              payload.productId,
              payload.startDate
            )
            .pipe(
              tap((data) => {
                this.overviewStore.setDownTimeChart(
                  data.map((element) => ({
                    name: element.Name ?? "",
                    series: [
                      { name: "Uptime", value: element.Uptime * 100 },
                      { name: "Downtime", value: element.Downtime * 100 },
                    ],
                  }))
                );
              }),
              finalize(() =>
                this.mainStore$.dispatch(loadingActions.hideLoading())
              ),
              catchError((error) => {
                this.mainStore$.dispatch(overviewFailure({ payload: error }));
                return of();
              })
            )
        )
      ),
    { dispatch: false }
  );

  getMachineOperationTable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getMachineOperationTable),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(({ payload }) =>
          this.machineOperationService
            .GetMachineOperationsofProduct(payload.productId)
            .pipe(
              tap((data) => {
                const gridData: DataGridCellModel[] = data.map((row) => ({
                  value: {
                    AssetNumber: row.AssetNumber,
                    OEE: row.OEE,
                    MDE: row.MDE,
                  },
                }));

                this.overviewStore.setMachineOperationTable(gridData);
              }),

              finalize(() =>
                this.mainStore$.dispatch(loadingActions.hideLoading())
              ),
              catchError((error) => {
                this.mainStore$.dispatch(overviewFailure({ payload: error }));
                return of();
              })
            )
        )
      ),
    { dispatch: false }
  );

  overviewFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(overviewFailure),
        tap(({ payload }) => console.error("Overview Failure:", payload))
      ),
    { dispatch: false }
  );
}
