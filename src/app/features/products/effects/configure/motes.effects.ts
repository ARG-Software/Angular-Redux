import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  ConfigureActions,
  ConfigurationActionTypes,
  GetMotesSuccess,
  AddMoteSuccess,
  RemoveMoteSuccess,
  ErrorConfiguration,
  GetMotesSelectBoxSuccess,
} from "../../actions/configure.actions";
import {
  tap,
  withLatestFrom,
  filter,
  switchMap,
  map,
  mergeMap,
  catchError,
  finalize,
} from "rxjs/operators";
import {
  MoteModelUI,
  ConfigureSelectBoxModelUI,
} from "../../models/configure.model";
import { Store, select } from "@ngrx/store";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { of } from "rxjs";
import { IMoteDto } from "src/app/api/models/apimodels";
import { IMoteService } from "src/app/api/services/interfaces/core/imote.service";

@Injectable()
export class ConfigureMotesEffects {
  private actions$ = inject(Actions);
  private moteService = inject<IMoteService>(IMoteService);
  private moduleStore$ = inject<Store<fromModule.ProductState>>(Store);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  public getMotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType<ConfigureActions>(ConfigurationActionTypes.GetMotes),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMotesUpdateState))
      ),
      filter(([_, updateNeeded]) => updateNeeded),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(([action, _]) =>
        this.moteService.GetMotesofProduct(action.payload).pipe(
          map((moteList: IMoteDto[]) => {
            const moteListCasted =
              mapObjectTypeToRequested<MoteModelUI[]>(moteList);
            const motesSelectBox = moteListCasted.map(
              (element) =>
                ({
                  name: element.Name,
                  selected: false,
                  value: element.Id,
                } as ConfigureSelectBoxModelUI)
            );

            return [
              new GetMotesSuccess(moteListCasted),
              new GetMotesSelectBoxSuccess(motesSelectBox),
            ];
          }),
          mergeMap((actions) => actions),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public addMote$ = createEffect(() =>
    this.actions$.pipe(
      ofType<ConfigureActions>(ConfigurationActionTypes.AddMote),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      map((action) => mapObjectTypeToRequested<IMoteDto>(action.payload)),
      switchMap((payload) =>
        this.moteService.AddMote(payload).pipe(
          map((addedMote: IMoteDto) => {
            const moteCasted = mapObjectTypeToRequested<MoteModelUI>(addedMote);
            return new AddMoteSuccess(moteCasted);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public removeMote$ = createEffect(() =>
    this.actions$.pipe(
      ofType<ConfigureActions>(ConfigurationActionTypes.RemoveMote),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.moteService.DeleteMote(action.payload).pipe(
          map((hasBeenDeleted: boolean) =>
            hasBeenDeleted
              ? new RemoveMoteSuccess(action.payload)
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
