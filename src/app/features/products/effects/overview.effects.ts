import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import {
  getDownTimeChart,
  getDownTimeChartSuccess,
  getMachineOperationTable,
  getMachineOperationTableSuccess,
  overviewFailure,
} from "../actions/overview.actions";

import { IDownTimeRecordService } from "src/app/api/services/interfaces/core/idowntimerecord.service";
import { IMachineOperationService } from "src/app/api/services/interfaces/core/imachineoperation.service";

import {
  IShiftGraphicDto,
  IMachineOperationsDto,
} from "src/app/api/models/apimodels";

@Injectable()
export class OverviewEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private machineOperationService = inject(IMachineOperationService);
  private downTimeRecordService = inject(IDownTimeRecordService);

  getDownTimeStatisticChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDownTimeChart),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        this.downTimeRecordService
          .getDowntimeOfProductShiftGraphic(
            payload.productId,
            payload.startDate
          )
          .pipe(
            map((graphicData: IShiftGraphicDto[]) =>
              getDownTimeChartSuccess({ payload: graphicData })
            ),
            catchError((error) => of(overviewFailure({ payload: error }))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  getMachineOperationTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMachineOperationTable),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        this.machineOperationService
          .GetMachineOperationsofProduct(payload.productId)
          .pipe(
            map((machinesData: IMachineOperationsDto[]) =>
              getMachineOperationTableSuccess({ payload: machinesData })
            ),
            catchError((error) => of(overviewFailure({ payload: error }))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
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
