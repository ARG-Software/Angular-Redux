import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject, throwError } from "rxjs";
import { ISettingsService } from "../../../api/services/interfaces/core/isettings.service";
import {
  loadSettingsData,
  loadSettingsDataSuccess,
  settingsFailure,
  updateKanBan,
  updateKanBanSuccess,
  updateWip,
  updateWipSuccess,
} from "../actions/settings.actions";
import {
  KanbanDataModelUIFactory,
  WipDataModelUIFactory,
} from "../models/settings.models";
import { SettingsEffects } from "./settings.effects";

describe("SettingsEffects", () => {
  let actions$: Subject<Action>;
  let effects: SettingsEffects;
  let service: jasmine.SpyObj<ISettingsService>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    service = jasmine.createSpyObj<ISettingsService>("ISettingsService", [
      "GetBuffersForProduct",
      "UpdateWip",
      "UpdateKanBan",
    ]);
    store = jasmine.createSpyObj<Store>("Store", ["dispatch"]);

    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockActions(() => actions$),
        { provide: ISettingsService, useValue: service },
        { provide: Store, useValue: store },
      ],
    });

    effects = TestBed.inject(SettingsEffects);
  });

  it("loads and converts buffer data", async () => {
    const buffers = [
      {
        Id: 1,
        ProductId: 2,
        Name: "Buffer",
        Count: 3,
        LowAlertLowerBound: 0,
        LowAlertLowWarning: 1,
        LowWarningTarget: 2,
        TargetHighWarning: 4,
        HighWarningHighAlert: 5,
        HighAlertUpperBound: 6,
      },
    ];
    service.GetBuffersForProduct.and.returnValue(of(buffers));

    const resultPromise = firstValueFrom(effects.loadSettingsData$);
    actions$.next(loadSettingsData({ productId: 2 }));
    const result = await resultPromise;

    expect(result).toEqual(
      loadSettingsDataSuccess({
        wip: [jasmine.objectContaining({ Id: 1, Name: "Buffer" })] as any,
        kanban: [jasmine.objectContaining({ Id: 1, Name: "Buffer" })] as any,
      })
    );
    expect(service.GetBuffersForProduct).toHaveBeenCalledWith(2);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it("returns settingsFailure when loading fails", async () => {
    const error = new Error("load failed");
    service.GetBuffersForProduct.and.returnValue(throwError(() => error));

    const resultPromise = firstValueFrom(effects.loadSettingsData$);
    actions$.next(loadSettingsData({ productId: 2 }));

    expect(await resultPromise).toEqual(settingsFailure({ error }));
  });

  it("returns update success actions", async () => {
    const wip = WipDataModelUIFactory.buildList(1);
    const kanban = KanbanDataModelUIFactory.buildList(1);
    service.UpdateWip.and.returnValue(of(true));
    service.UpdateKanBan.and.returnValue(of(false));

    const wipResultPromise = firstValueFrom(effects.updateWipData$);
    actions$.next(updateWip({ wip }));
    expect(await wipResultPromise).toEqual(updateWipSuccess({ success: true }));

    const kanbanResultPromise = firstValueFrom(effects.updateKanbanData$);
    actions$.next(updateKanBan({ kanban }));
    expect(await kanbanResultPromise).toEqual(
      updateKanBanSuccess({ success: false })
    );
  });
});
