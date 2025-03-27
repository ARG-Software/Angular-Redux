import { inject, Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as SettingsActions from "../actions/settings.actions";
import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import { ISettingsService } from "src/app/api/services/interfaces/core/isettings.service";
import * as MimsModels from "src/app/api/models/apimodels";
import { convertDataInWipUIAndKanBanUIModels } from "src/app/utils/funtion.utils";

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private settingsService = inject(ISettingsService);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  loadSettingsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSettingsData),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ productId }) =>
        this.settingsService.GetBuffersForProduct(productId).pipe(
          map((response: MimsModels.IBufferDto[]) => {
            const data = convertDataInWipUIAndKanBanUIModels(response);
            return SettingsActions.loadSettingsDataSuccess({
              wip: data.Wip,
              kanban: data.Kanban,
            });
          }),
          catchError((error) => of(SettingsActions.settingsFailure({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  updateWipData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateWip),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ wip }) =>
        this.settingsService.UpdateWip(wip).pipe(
          map((success) => SettingsActions.updateWipSuccess({ success })),
          catchError((error) => of(SettingsActions.settingsFailure({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  updateKanbanData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateKanBan),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ kanban }) =>
        this.settingsService.UpdateKanBan(kanban).pipe(
          map((success) => SettingsActions.updateKanBanSuccess({ success })),
          catchError((error) => of(SettingsActions.settingsFailure({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  settingsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.settingsFailure),
        tap(({ error }) => console.error("Settings Failure:", error))
      ),
    { dispatch: false }
  );
}
