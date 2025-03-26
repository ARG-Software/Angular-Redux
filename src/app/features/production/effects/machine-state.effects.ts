import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { apiRequest } from "../../../utils/funtion.utils";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import {
  getMachineData,
  getMachineDataSuccess,
  updateMachineData,
  updateMachineDataSuccess,
  machineFailure,
} from "../actions/machine-state.actions";

import {
  MachineStateSaveDataModelUI,
  MachineStateLoadDataModelUIFactory,
  MachineStateDataRequestModelUI,
} from "../models/machine-state.model";
import { IMachineStateService } from "src/app/api/services/interfaces/core/production/imachine-state.service";

@Injectable()
export class MachineStateEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  constructor(private machineStateService: IMachineStateService) {}

  getMachineStateData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMachineData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() =>
            getMachineDataSuccess({
              payload: MachineStateLoadDataModelUIFactory,
            })
          ),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(machineFailure({ payload: error })))
        )
      )
    )
  );

  updateMachineState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMachineData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() => updateMachineDataSuccess({ payload: true })),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(machineFailure({ payload: error })))
        )
      )
    )
  );

  machineStateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(machineFailure),
        tap((error) => console.error("MachineState Error:", error))
      ),
    { dispatch: false }
  );
}
