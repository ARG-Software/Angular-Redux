import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";

import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";
import {
  getMessagingData,
  updateMessagingData,
  messagingFailure,
} from "../actions/messaging.actions";

import { MessagingLoadDataModelUIFactory } from "../models/messaging.model";

import { apiRequest } from "../../../utils/funtion.utils";
import { IMessagingService } from "src/app/api/services/interfaces/core/production/imessaging.service";
import { MessagingStore } from "../store/messaging.store";

@Injectable()
export class MessagingEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private messagingStore = inject(MessagingStore);

  constructor(private messagingService: IMessagingService) {}

  getMessagingData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getMessagingData),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(({ payload }) =>
          apiRequest().pipe(
            tap(() => {
              this.messagingStore.setMessagingData(
                MessagingLoadDataModelUIFactory
              );
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(messagingFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  updateMessaging$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateMessagingData),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(({ payload }) =>
          apiRequest().pipe(
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(messagingFailure({ payload: error }));
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );
}
