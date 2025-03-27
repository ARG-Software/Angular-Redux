import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";

import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";

import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { IMachineOperationService } from "src/app/api/services/interfaces/core/imachineoperation.service";
import { MachineOperationModelUI } from "../../models/configure.model";
import { IMachineOperationsDto } from "src/app/api/models/apimodels";
import {
  addMachineOperation,
  addMachineOperationSuccess,
  getMachineOperations,
  getMachineOperationsSuccess,
  machineOperationFailure,
  removeMachineOperation,
  removeMachineOperationSuccess,
} from "../../actions/configure.actions";

@Injectable()
export class ConfigureMachinesOperationEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private moduleStore$ = inject<Store<fromModule.ProductState>>(Store);
  private machineOperationService = inject<IMachineOperationService>(
    IMachineOperationService
  );

  getMachineOperations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMachineOperations),
      withLatestFrom(
        this.moduleStore$.pipe(
          select(fromModule.getMachineOperationsUpdateState)
        )
      ),
      filter(([_, needsUpdate]) => needsUpdate),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(([{ productId }]) =>
        this.machineOperationService
          .GetMachineOperationsofProduct(productId)
          .pipe(
            map((data) =>
              getMachineOperationsSuccess({
                machines:
                  mapObjectTypeToRequested<MachineOperationModelUI[]>(data),
              })
            ),
            catchError((error) => of(machineOperationFailure({ error }))),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            )
          )
      )
    )
  );

  addMachineOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addMachineOperation),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ machine }) => {
        const dto: IMachineOperationsDto = {
          Id: machine.Id,
          MachineId: machine.MachineId,
          MachineName: machine.MachineName ?? "",
          OperationId: machine.OperationId,
          OperationName: machine.OperationName ?? "",
          AssetNumber: 0,
          OEE: machine.OEE,
          MDE: machine.MDE,
        };

        return this.machineOperationService.AddMachineOperation(dto).pipe(
          map((response) =>
            addMachineOperationSuccess({
              machine:
                mapObjectTypeToRequested<MachineOperationModelUI>(response),
            })
          ),
          catchError((error) => of(machineOperationFailure({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        );
      })
    )
  );

  removeMachineOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMachineOperation),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ id }) =>
        this.machineOperationService.DeleteMachineOperation(id).pipe(
          map((success) =>
            success
              ? removeMachineOperationSuccess({ id })
              : machineOperationFailure({ error: "Delete failed" })
          ),
          catchError((error) => of(machineOperationFailure({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );
}
