import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import {
  ConfigurationActionTypes,
  GetMachineOperationSuccess,
  AddMachineOperationSuccess,
  RemoveMachineOperationSuccess,
  ErrorConfiguration,
  GetMachineOperations,
  AddMachineOperation,
  RemoveMachineOperation,
} from "../../actions/configure.actions";
import {
  tap,
  withLatestFrom,
  filter,
  switchMap,
  map,
  catchError,
  finalize,
} from "rxjs/operators";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { of } from "rxjs";
import { MachineOperationModelUI } from "../../models/configure.model";
import { IMachineOperationService } from "src/app/api/services/interfaces/core/imachineoperation.service";
import { IMachineOperationsDto } from "src/app/api/models/apimodels";

@Injectable()
export class ConfigureMachinesOperationEffects {
  constructor(
    private actions$: Actions,
    private moduleStore$: Store<fromModule.ProductState>,
    private mainStore$: Store<fromMain.MainState>,
    private machineOperationService: IMachineOperationService
  ) {}

  getMachineOperations$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMachineOperations>(
        ConfigurationActionTypes.GetMachineOperations
      ),
      withLatestFrom(
        this.moduleStore$.pipe(
          select(fromModule.getMachineOperationsUpdateState)
        )
      ),
      filter(([_, updateNeeded]) => updateNeeded),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(([action, _]) =>
        this.machineOperationService
          .GetMachineOperationsofProduct(action.payload)
          .pipe(
            map((machineOperationList: IMachineOperationsDto[]) => {
              const machineOperationListCasted =
                mapObjectTypeToRequested<MachineOperationModelUI[]>(
                  machineOperationList
                );
              return new GetMachineOperationSuccess(machineOperationListCasted);
            }),
            catchError((error) => of(new ErrorConfiguration(error))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  addMachineOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AddMachineOperation>(ConfigurationActionTypes.AddMachineOperation),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.machineOperationService
          .AddMachineOperation(action.payload as any)
          .pipe(
            map((addedMachineOperation: IMachineOperationsDto) => {
              const machineOperationCasted =
                mapObjectTypeToRequested<MachineOperationModelUI>(
                  addedMachineOperation
                );
              return new AddMachineOperationSuccess(machineOperationCasted);
            }),
            catchError((error) => of(new ErrorConfiguration(error))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  removeMachineOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RemoveMachineOperation>(
        ConfigurationActionTypes.RemoveMachineOperation
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.machineOperationService
          .DeleteMachineOperation(action.payload)
          .pipe(
            map((hasBeenDeleted: boolean) => {
              return hasBeenDeleted
                ? new RemoveMachineOperationSuccess(action.payload)
                : new ErrorConfiguration({});
            }),
            catchError((error) => of(new ErrorConfiguration(error))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );
}
