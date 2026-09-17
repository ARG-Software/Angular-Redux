import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject } from "rxjs";
import { IMessagingService } from "../../../api/services/interfaces/core/production/imessaging.service";
import {
  getMessagingData,
  updateMessagingData,
} from "../actions/messaging.actions";
import {
  MessagingLoadDataModelUIFactory,
  MessagingRequestModelUIFactory,
  MessagingSaveDataModelUIFactory,
} from "../models/messaging.model";
import { MessagingStore } from "../store/messaging.store";
import { MessagingEffects } from "./messaging.effects";

describe("MessagingEffects", () => {
  let actions$: Subject<Action>;
  let effects: MessagingEffects;
  let store: jasmine.SpyObj<Store>;
  let messagingStore: jasmine.SpyObj<InstanceType<typeof MessagingStore>>;
  let service: jasmine.SpyObj<IMessagingService>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    store = jasmine.createSpyObj<Store>("Store", ["dispatch"]);
    messagingStore = jasmine.createSpyObj("MessagingStore", [
      "setMessagingData",
    ]);
    service = jasmine.createSpyObj<IMessagingService>("IMessagingService", [
      "GetMessagingData",
      "UpdateMessagingData",
    ]);

    TestBed.configureTestingModule({
      providers: [
        MessagingEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store },
        { provide: MessagingStore, useValue: messagingStore },
        { provide: IMessagingService, useValue: service },
      ],
    });

    effects = TestBed.inject(MessagingEffects);
  });

  it("loads current messaging data into the signal store", async () => {
    service.GetMessagingData.and.returnValue(of(MessagingLoadDataModelUIFactory));
    const resultPromise = firstValueFrom(effects.getMessagingData$);

    actions$.next(getMessagingData({ payload: MessagingRequestModelUIFactory }));
    await resultPromise;

    expect(messagingStore.setMessagingData).toHaveBeenCalledWith(
      MessagingLoadDataModelUIFactory
    );
    expect(service.GetMessagingData).toHaveBeenCalledWith(
      MessagingRequestModelUIFactory
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it("runs the update request with loading state", async () => {
    service.UpdateMessagingData.and.returnValue(of(true));
    const resultPromise = firstValueFrom(effects.updateMessaging$);

    actions$.next(
      updateMessagingData({ payload: [MessagingSaveDataModelUIFactory] })
    );
    await resultPromise;

    expect(service.UpdateMessagingData).toHaveBeenCalledWith([
      MessagingSaveDataModelUIFactory,
    ]);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
