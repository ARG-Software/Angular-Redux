import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  getMachineData,
  updateMachineData,
  machineFailure,
} from "../actions/machine-state.actions";
import { MachineStateLoadDataModelUIFactory } from "../models/machine-state.model";
import { MachineStateStore } from "../store/machine-state.store";
import { IMachineStateService } from "src/app/api/services/interfaces/core/production/imachine-state.service";

@Injectable()
export class MachineStateEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private machineStore = inject(MachineStateStore);

  constructor(private machineStateService: IMachineStateService) {}

  getMachineStateData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getMachineData),
        tap(() => {
          this.mainStore$.dispatch(loadingActions.showLoading());
        }),
        switchMap(({ payload }) =>
          of(MachineStateLoadDataModelUIFactory).pipe(
            tap((data) => {
              this.machineStore.setMachineData(data);
            }),
            finalize(() => {
              this.mainStore$.dispatch(loadingActions.hideLoading());
            }),
            catchError((error) => {
              this.mainStore$.dispatch(machineFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  updateMachineState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateMachineData),
        tap(() => {
          this.mainStore$.dispatch(loadingActions.showLoading());
        }),
        switchMap(({ payload }) =>
          of(true).pipe(
            tap(() => {
              this.machineStore.updateMachine(payload);
            }),
            finalize(() => {
              this.mainStore$.dispatch(loadingActions.hideLoading());
            }),
            catchError((error) => {
              this.mainStore$.dispatch(machineFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );
}
