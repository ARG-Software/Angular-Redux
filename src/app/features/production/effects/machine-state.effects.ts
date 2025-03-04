import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { apiRequest } from "../../../utils/funtion.utils";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import {
  MachineFailure,
  MachineStateActionTypes,
  GetMachineData,
  GetMachineDataSuccess,
  UpdateMachineData,
  UpdateMachineDataSuccess,
} from "../actions/machine-state.actions";

import {
  MachineStateSaveDataModelUI,
  MachineStateLoadDataModelUIFactory,
  MachineStateDataRequestModelUI,
} from "../models/machine-state.model";
import { IMachineStateService } from "src/app/api/services/interfaces/core/production/imachine-state.service";

@Injectable()
export class MachineStateEffects {
  constructor(
    private actions$: Actions,
    private mainStore$: Store<fromMain.MainState>,
    private machineStateService: IMachineStateService
  ) {}

  getMachineStateData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMachineData>(MachineStateActionTypes.GetMachineData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(
            (response: any[]) =>
              new GetMachineDataSuccess(MachineStateLoadDataModelUIFactory)
          ),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(new MachineFailure(error)))
        )
      )
    )
  );

  updateMachineState$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateMachineData>(MachineStateActionTypes.UpdateMachineData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() => new UpdateMachineDataSuccess(true)),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(new MachineFailure(error)))
        )
      )
    )
  );

  machineStateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MachineFailure>(MachineStateActionTypes.MachineFailure),
        tap((error) => console.error("MachineState Error:", error))
      ),
    { dispatch: false }
  );
}
