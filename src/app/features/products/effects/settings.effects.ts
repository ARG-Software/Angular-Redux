import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  LoadData,
  LoadDataSuccess,
  SettingsActionTypes,
  SettingsFailure,
  UpdateKanBan,
  UpdateKanBanSuccess,
  UpdateWip,
  UpdateWipSuccess,
} from "../actions/settings.actions";
import { KanbanDataModelUI, WipDataModelUI } from "../models/settings.models";
import * as MimsModels from "src/app/api/models/apimodels";
import { ISettingsService } from "src/app/api/services/interfaces/core/isettings.service";

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  constructor(
    private settingsService: ISettingsService,
    private mainStore$: Store<fromMain.MainState>
  ) {}

  public getData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadData>(SettingsActionTypes.LoadData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.settingsService.GetBuffersForProduct(action.payload).pipe(
          map((response: MimsModels.IBufferDto[]) => {
            const processedData = convertDataInWipUIAndKanBanUIModels(response);
            return new LoadDataSuccess(processedData);
          }),
          catchError((error) => of(new SettingsFailure(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public updateWipData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateWip>(SettingsActionTypes.UpdateWip),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.settingsService.UpdateWip(action.payload).pipe(
          map((wipData: boolean) => new UpdateWipSuccess(wipData)),
          catchError((error) => of(new SettingsFailure(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public updateKanbanData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateKanBan>(SettingsActionTypes.UpdateKanBan),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.settingsService.UpdateKanBan(action.payload).pipe(
          map((kanbanData: boolean) => new UpdateKanBanSuccess(kanbanData)),
          catchError((error) => of(new SettingsFailure(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public settingsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SettingsFailure>(SettingsActionTypes.SettingsFailure),
        tap((error) => console.error("Settings Failure:", error))
      ),
    { dispatch: false }
  );
}

export function convertDataInWipUIAndKanBanUIModels(
  data: MimsModels.IBufferDto[]
) {
  return data.reduce(
    (acc, elem) => {
      const item = {
        Name: elem.Name,
        Count: elem.Count,
        Id: elem.Id,
        ProductId: elem.ProductId,
        LowAlertLowWarning: elem.LowAlertLowWarning,
        LowWarningTarget: elem.LowWarningTarget,
        TargetHighWarning: elem.TargetHighWarning,
        HighWarningHighAlert: elem.HighWarningHighAlert,
        NextOperationId: elem.NextOperationId,
        PreviousOperationId: elem.PreviousOperationId,
      };
      acc.Wip.push(item);
      acc.Kanban.push(item);
      return acc;
    },
    { Wip: [] as WipDataModelUI[], Kanban: [] as KanbanDataModelUI[] }
  );
}
