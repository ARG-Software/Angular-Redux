import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  addMote,
  addMoteSuccess,
  motesConfigurationError,
  getMotes,
  getMotesSelectBoxSuccess,
  getMotesSuccess,
  removeMote,
  removeMoteSuccess,
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

  getMotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMotes),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMotesUpdateState))
      ),
      filter(([_, updateNeeded]) => updateNeeded),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(([{ productId }]) =>
        this.moteService.GetMotesofProduct(productId).pipe(
          map((list) => {
            const motes = mapObjectTypeToRequested<MoteModelUI[]>(list);
            const selectBox = motes.map((m) => ({
              name: m.Name,
              value: m.Id,
              selected: false,
            }));
            return [
              getMotesSuccess({ motes }),
              getMotesSelectBoxSuccess({ selectBox }),
            ];
          }),
          mergeMap((actions) => actions),
          catchError((error) => of(motesConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  addMote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addMote),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ mote }) =>
        this.moteService.AddMote(mapObjectTypeToRequested(mote)).pipe(
          map((response) =>
            addMoteSuccess({ mote: mapObjectTypeToRequested(response) })
          ),
          catchError((error) => of(motesConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  removeMote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMote),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ moteId }) =>
        this.moteService.DeleteMote(moteId).pipe(
          map((success) =>
            success
              ? removeMoteSuccess({ moteId })
              : motesConfigurationError({ error: "Delete failed" })
          ),
          catchError((error) => of(motesConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );
}
