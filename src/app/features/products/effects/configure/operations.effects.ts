import { Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import {
  GetOperations,
  AddOperation,
  RemoveOperation,
  GetOperationsSuccess,
  AddOpertionSuccess,
  RemoveOperationSuccess,
  ErrorConfiguration,
  GetOperationsSelectBoxSuccess,
  ConfigurationActionTypes,
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
  constructor(
    private actions$: Actions,
    private moduleStore$: Store<fromModule.ProductState>,
    private mainStore$: Store<fromMain.MainState>,
    private operationService: IOperationService
  ) {}

  public getOperations$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetOperations>(ConfigurationActionTypes.GetOperations),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getOperationsUpdateState))
      ),
      filter(([_, updateNeeded]) => updateNeeded),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(([action]) =>
        this.operationService.GetOperationsByProductId(action.payload).pipe(
          map((operationList: IOperationDto[]) => {
            const operationListCasted =
              mapObjectTypeToRequested<OperationModelUI[]>(operationList);
            const operationsSelectBox = operationListCasted.map((element) => ({
              name: element.Description,
              selected: false,
              value: element.Id,
            }));
            return [
              new GetOperationsSuccess(operationListCasted),
              new GetOperationsSelectBoxSuccess(operationsSelectBox),
            ];
          }),
          concatMap((actions) => actions),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public addOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AddOperation>(ConfigurationActionTypes.AddOperation),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      map((action) => mapObjectTypeToRequested<IOperationDto>(action.payload)),
      switchMap((payload) =>
        this.operationService.AddOperation(payload).pipe(
          map((addedOperation: IOperationDto) => {
            const operationCasted =
              mapObjectTypeToRequested<OperationModelUI>(addedOperation);
            return new AddOpertionSuccess(operationCasted);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public removeOperation$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RemoveOperation>(ConfigurationActionTypes.RemoveOperation),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.operationService.DeleteOperation(action.payload).pipe(
          map((hasBeenDeleted: boolean) =>
            hasBeenDeleted
              ? new RemoveOperationSuccess(action.payload)
              : new ErrorConfiguration({})
          ),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );
}
