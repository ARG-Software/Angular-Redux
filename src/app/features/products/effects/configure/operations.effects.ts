import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import {
  addOperation,
  addOperationSuccess,
  getOperations,
  getOperationsSelectBoxSuccess,
  getOperationsSuccess,
  operationConfigurationError,
  removeOperation,
  removeOperationSuccess,
} from "../../actions/configure.actions";
import {
  tap,
  switchMap,
  map,
  finalize,
  catchError,
  filter,
  withLatestFrom,
  concatMap,
} from "rxjs/operators";
import { OperationModelUI } from "../../models/configure.model";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { of } from "rxjs";
import { IOperationDto } from "src/app/api/models/apimodels";
import { IOperationService } from "src/app/api/services/interfaces/core/ioperation.service";

@Injectable()
export class ConfigureOperationsEffects {
  private actions$ = inject(Actions);
  private moduleStore$ = inject<Store<fromModule.ProductState>>(Store);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private operationService = inject<IOperationService>(IOperationService);

  getOperations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOperations),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getOperationsUpdateState))
      ),
      filter(([_, updateNeeded]) => updateNeeded),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(([{ productId }]) =>
        this.operationService.GetOperationsByProductId(productId).pipe(
          map((list) => {
            const operations =
              mapObjectTypeToRequested<OperationModelUI[]>(list);
            const selectBox = operations.map((o) => ({
              name: o.Description,
              value: o.Id,
              selected: false,
            }));
            return [
              getOperationsSuccess({ operations }),
              getOperationsSelectBoxSuccess({ selectBox }),
            ];
          }),
          concatMap((actions) => actions),
          catchError((error) => of(operationConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  addOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addOperation),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ operation }) =>
        this.operationService
          .AddOperation(mapObjectTypeToRequested(operation))
          .pipe(
            map((response) =>
              addOperationSuccess({
                operation: mapObjectTypeToRequested(response),
              })
            ),
            catchError((error) => of(operationConfigurationError({ error }))),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            )
          )
      )
    )
  );

  removeOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeOperation),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ operationId }) =>
        this.operationService.DeleteOperation(operationId).pipe(
          map((success) =>
            success
              ? removeOperationSuccess({ operationId })
              : operationConfigurationError({ error: "Delete failed" })
          ),
          catchError((error) => of(operationConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );
}
