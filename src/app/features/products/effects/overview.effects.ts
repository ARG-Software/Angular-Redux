import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  GetDownTimeChart,
  GetDownTimeChartSuccess,
  GetMachineOperationTable,
  GetMachineOperationTableSuccess,
  OverviewActionTypes,
  OverviewFailure,
} from "../actions/overview.actions";
import {
  IShiftGraphicDto,
  IMachineOperationsDto,
} from "src/app/api/models/apimodels";
import { IDownTimeRecordService } from "src/app/api/services/interfaces/core/idowntimerecord.service";
import { IMachineOperationService } from "src/app/api/services/interfaces/core/imachineoperation.service";

@Injectable()
export class OverviewEffects {
  constructor(
    private actions$: Actions,
    private machineOperationService: IMachineOperationService,
    private downTimeRecordService: IDownTimeRecordService,
    private mainStore$: Store<fromMain.MainState>
  ) {}

  public getDownTimeStatisticChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetDownTimeChart>(OverviewActionTypes.GetDownTimeChart),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.downTimeRecordService
          .getDowntimeOfProductShiftGraphic(
            action.payload.productId,
            action.payload.startDate
          )
          .pipe(
            map((graphicData: IShiftGraphicDto[]) =>
              graphicData
                ? new GetDownTimeChartSuccess(graphicData)
                : new OverviewFailure({})
            ),
            catchError((error) => of(new OverviewFailure(error))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  public getStatisticsChartDataSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetDownTimeChartSuccess>(
          OverviewActionTypes.GetDownTimeChartSuccess
        )
      ),
    { dispatch: false }
  );

  public getMachineOperationTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMachineOperationTable>(
        OverviewActionTypes.GetMachineOperationTable
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.machineOperationService
          .GetMachineOperationsofProduct(action.payload.productId)
          .pipe(
            map((machinesData: IMachineOperationsDto[]) =>
              machinesData
                ? new GetMachineOperationTableSuccess(machinesData)
                : new OverviewFailure({})
            ),
            catchError((error) => of(new OverviewFailure(error))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  public getMachineOperationTableSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetMachineOperationTableSuccess>(
          OverviewActionTypes.GetMachineOperationTableSuccess
        )
      ),
    { dispatch: false }
  );

  public overviewFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<OverviewFailure>(OverviewActionTypes.OverviewFailure),
        tap((error) => console.error("Overview Failure:", error))
      ),
    { dispatch: false }
  );
}
