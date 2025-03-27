import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  getMessagingData,
  getMessagingDataSuccess,
  updateMessagingData,
  updateMessagingDataSuccess,
  messagingFailure,
} from "../actions/messaging.actions";

import { MessagingLoadDataModelUIFactory } from "../models/messaging.model";

import { apiRequest } from "../../../utils/funtion.utils";
import { IMessagingService } from "src/app/api/services/interfaces/core/production/imessaging.service";

@Injectable()
export class MessagingEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  constructor(private messagingService: IMessagingService) {}

  getMessagingData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMessagingData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() =>
            getMessagingDataSuccess({
              payload: MessagingLoadDataModelUIFactory,
            })
          ),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(messagingFailure({ payload: error })))
        )
      )
    )
  );

  updateMessaging$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMessagingData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() => updateMessagingDataSuccess({ payload: true })),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(messagingFailure({ payload: error })))
        )
      )
    )
  );

  messagingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(messagingFailure),
        tap(({ payload }) => console.error("Messaging Error:", payload))
      ),
    { dispatch: false }
  );
}
