import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  MessagingFailure,
  MessagingActionTypes,
  UpdateMessagingData,
  UpdateMessagingDataSuccess,
  GetMessagingData,
  GetMessagingDataSuccess,
} from "../actions/messaging.actions";

import {
  MessagingLoadDataModelUI,
  MessagingLoadDataModelUIFactory,
} from "../models/messaging.model";

import { apiRequest } from "../../../utils/funtion.utils";
import { IMessagingService } from "src/app/api/services/interfaces/core/production/imessaging.service";

@Injectable()
export class MessagingEffects {
  constructor(
    private actions$: Actions,
    private mainStore$: Store<fromMain.MainState>,
    private messagingService: IMessagingService
  ) {}

  getMessagingData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMessagingData>(MessagingActionTypes.GetMessagingData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(
            () => new GetMessagingDataSuccess(MessagingLoadDataModelUIFactory)
          ),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(new MessagingFailure(error)))
        )
      )
    )
  );

  updateMessaging$ = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateMessagingData>(MessagingActionTypes.UpdateMessagingData),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ payload }) =>
        apiRequest().pipe(
          map(() => new UpdateMessagingDataSuccess(true)),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => of(new MessagingFailure(error)))
        )
      )
    )
  );

  messagingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MessagingFailure>(MessagingActionTypes.MessagingFailure),
        tap((error) => console.error("Messaging Error:", error))
      ),
    { dispatch: false }
  );
}
