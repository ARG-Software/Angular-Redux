import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, of, Subject } from "rxjs";
import { IMachineStateService } from "../../../api/services/interfaces/core/production/imachine-state.service";
import {
  getMachineData,
  updateMachineData,
} from "../actions/machine-state.actions";
import {
  MachineStateDataRequestModelUIFactory,
  MachineStateLoadDataModelUIFactory,
  MachineStateSaveDataModelUIFactory,
} from "../models/machine-state.model";
import { MachineStateStore } from "../store/machine-state.store";
import { MachineStateEffects } from "./machine-state.effects";

describe("MachineStateEffects", () => {
  let actions$: Subject<Action>;
  let effects: MachineStateEffects;
  let store: jasmine.SpyObj<Store>;
  let machineStore: jasmine.SpyObj<InstanceType<typeof MachineStateStore>>;
  let service: jasmine.SpyObj<IMachineStateService>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    store = jasmine.createSpyObj<Store>("Store", ["dispatch"]);
    machineStore = jasmine.createSpyObj("MachineStateStore", [
      "setMachineData",
      "updateMachine",
    ]);
    service = jasmine.createSpyObj<IMachineStateService>(
      "IMachineStateService",
      ["GetMachineStateData", "UpdateMachineStateData"]
    );

    TestBed.configureTestingModule({
      providers: [
        MachineStateEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store },
        { provide: MachineStateStore, useValue: machineStore },
        { provide: IMachineStateService, useValue: service },
      ],
    });

    effects = TestBed.inject(MachineStateEffects);
  });

  it("loads current machine data into the signal store", async () => {
    service.GetMachineStateData.and.returnValue(
      of(MachineStateLoadDataModelUIFactory)
    );
    const resultPromise = firstValueFrom(effects.getMachineStateData$);

    actions$.next(
      getMachineData({ payload: MachineStateDataRequestModelUIFactory })
    );
    await resultPromise;

    expect(machineStore.setMachineData).toHaveBeenCalledWith(
      MachineStateLoadDataModelUIFactory
    );
    expect(service.GetMachineStateData).toHaveBeenCalledWith(
      MachineStateDataRequestModelUIFactory
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it("updates a machine in the signal store", async () => {
    service.UpdateMachineStateData.and.returnValue(of(true));
    const resultPromise = firstValueFrom(effects.updateMachineState$);

    actions$.next(
      updateMachineData({ payload: MachineStateSaveDataModelUIFactory })
    );
    await resultPromise;

    expect(machineStore.updateMachine).toHaveBeenCalledWith(
      MachineStateSaveDataModelUIFactory
    );
    expect(service.UpdateMachineStateData).toHaveBeenCalledWith(
      MachineStateSaveDataModelUIFactory
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
