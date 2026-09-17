import * as ConfigureActions from "../actions/configure.actions";
import {
  MachineOperationModelUI,
  MoteModelUI,
  OperationModelUI,
  ProductModelUI,
  SensorModelUI,
} from "../models/configure.model";
import {
  ConfigureState,
  configureReducer,
  initialState,
} from "./configure.reducers";

describe("Configure Reducer", () => {
  const product: ProductModelUI = {
    Id: 1,
    Name: "Product",
    TargetHoursPerWeek: 40,
    TargetEfficiency: 90,
  };
  const operation: OperationModelUI = {
    Id: 2,
    ProductId: 1,
    Number: 10,
    Description: "Cutting",
    Subcontractor: { Id: 3, Name: "Partner" },
  };
  const machine: MachineOperationModelUI = {
    Id: 4,
    ProductId: 1,
    MachineId: 5,
    MachineName: "Machine",
    OperationId: 2,
    OEE: 80,
    MDE: 90,
  };
  const mote: MoteModelUI = {
    Id: 6,
    ProductId: 1,
    Name: "Mote",
    MachineId: 5,
    EdgeId: 7,
    PollInterval: 30,
  };
  const sensor: SensorModelUI = {
    Id: 8,
    ProductId: 1,
    ContactMessageId: 9,
    MoteId: 6,
    MachineInputTerminal: "I1",
    MachineMCode: "M1",
    LineOut: "O1",
  };
  const selectBox = [{ name: "Option", value: 1, selected: false }];

  it("returns the initial state for an unknown action", () => {
    expect(configureReducer(undefined, { type: "Unknown" })).toEqual(initialState);
  });

  it("stores and updates product details", () => {
    const loaded = configureReducer(
      initialState,
      ConfigureActions.getProductDetailsSuccess({ product })
    );
    const updated = configureReducer(
      loaded,
      ConfigureActions.saveProductDetailsSuccess({
        product: { ...product, TargetEfficiency: 95 },
      })
    );

    expect(loaded.productsPage.productDetails).toEqual(product);
    expect(updated.productsPage.productDetails.TargetEfficiency).toBe(95);
  });

  it("loads, adds, and removes operations and their select-box entries", () => {
    const loaded = configureReducer(
      initialState,
      ConfigureActions.getOperationsSuccess({ operations: [operation] })
    );
    const addedOperation = { ...operation, Id: 10, Description: "Polishing" };
    const added = configureReducer(
      loaded,
      ConfigureActions.addOperationSuccess({ operation: addedOperation })
    );
    const removed = configureReducer(
      added,
      ConfigureActions.removeOperationSuccess({ operationId: 10 })
    );

    expect(loaded.operationsPage).toEqual({
      operations: [operation],
      originalOperations: [operation],
      needsUpdate: false,
    });
    expect(added.operationsSelectBox[0]).toEqual({
      name: "Polishing",
      value: 10,
      selected: false,
    });
    expect(removed.operationsPage.operations).toEqual([operation]);
    expect(removed.operationsSelectBox).toEqual([]);
  });

  it("loads, adds, and removes machine operations", () => {
    const loaded = configureReducer(
      initialState,
      ConfigureActions.getMachineOperationsSuccess({ machines: [machine] })
    );
    const addedMachine = { ...machine, Id: 11 };
    const added = configureReducer(
      loaded,
      ConfigureActions.addMachineOperationSuccess({ machine: addedMachine })
    );
    const removed = configureReducer(
      added,
      ConfigureActions.removeMachineOperationSuccess({ id: 11 })
    );

    expect(loaded.machinesPage.originalMachines).toEqual([machine]);
    expect(loaded.machinesPage.needsUpdate).toBeFalse();
    expect(added.machinesPage.machines[0]).toEqual(addedMachine);
    expect(removed.machinesPage.machines).toEqual([machine]);
  });

  it("loads, adds, and removes motes and their select-box entries", () => {
    const loaded = configureReducer(
      initialState,
      ConfigureActions.getMotesSuccess({ motes: [mote] })
    );
    const addedMote = { ...mote, Id: 12, Name: "Mote 2" };
    const added = configureReducer(
      loaded,
      ConfigureActions.addMoteSuccess({ mote: addedMote })
    );
    const removed = configureReducer(
      added,
      ConfigureActions.removeMoteSuccess({ moteId: 12 })
    );

    expect(loaded.motesPage.originalMotes).toEqual([mote]);
    expect(loaded.motesPage.needsUpdate).toBeFalse();
    expect(added.motesSelectBox[0]).toEqual({
      name: "Mote 2",
      value: 12,
      selected: false,
    });
    expect(removed.motesPage.motes).toEqual([mote]);
    expect(removed.motesSelectBox).toEqual([]);
  });

  it("loads, adds, and removes sensors", () => {
    const loaded = configureReducer(
      initialState,
      ConfigureActions.getSensorsSuccess({ sensors: [sensor] })
    );
    const addedSensor = { ...sensor, Id: 13 };
    const added = configureReducer(
      loaded,
      ConfigureActions.addSensorSuccess({ sensor: addedSensor })
    );
    const removed = configureReducer(
      added,
      ConfigureActions.removeSensorSuccess({ sensorId: 13 })
    );

    expect(loaded.sensorsPage.originalSensors).toEqual([sensor]);
    expect(loaded.sensorsPage.needsUpdate).toBeFalse();
    expect(added.sensorsPage.sensors[0]).toEqual(addedSensor);
    expect(removed.sensorsPage.sensors).toEqual([sensor]);
  });

  it("stores all configuration select-box data", () => {
    let state = configureReducer(
      initialState,
      ConfigureActions.getOperationsSelectBoxSuccess({ selectBox })
    );
    state = configureReducer(
      state,
      ConfigureActions.getMotesSelectBoxSuccess({ selectBox })
    );
    state = configureReducer(
      state,
      ConfigureActions.getEdgesSelectBoxSuccess({ selectBox })
    );
    state = configureReducer(
      state,
      ConfigureActions.getMessagesSelectBoxSuccess({ selectBox })
    );
    state = configureReducer(
      state,
      ConfigureActions.getSubcontractorsSelectBoxSuccess({ selectBox })
    );
    state = configureReducer(
      state,
      ConfigureActions.getMachineSelectBoxSuccess({ selectBox })
    );

    expect(state.operationsSelectBox).toEqual(selectBox);
    expect(state.motesSelectBox).toEqual(selectBox);
    expect(state.edgeSelectBox).toEqual(selectBox);
    expect(state.messageSelectBox).toEqual(selectBox);
    expect(state.subcontractorsSelectBox).toEqual(selectBox);
    expect(state.machineSelectBox).toEqual(selectBox);
  });

  it("builds a resume page from added and removed entities", () => {
    const addedSensor = { ...sensor, Id: 20 };
    const removedOperation = { ...operation, Id: 21 };
    const changedState: ConfigureState = {
      ...initialState,
      operationsPage: {
        operations: [],
        originalOperations: [removedOperation],
        needsUpdate: false,
      },
      sensorsPage: {
        sensors: [sensor, addedSensor],
        originalSensors: [sensor],
        needsUpdate: false,
      },
    };

    const result = configureReducer(
      changedState,
      ConfigureActions.getResumePage({ payload: null })
    );

    expect(result.resumePage.removedOperations).toEqual([removedOperation]);
    expect(result.resumePage.addedSensors).toEqual([addedSensor]);
  });

  it("resets configuration when the wizard finishes", () => {
    const changedState = {
      ...initialState,
      productsPage: { productDetails: product },
    };

    expect(
      configureReducer(changedState, ConfigureActions.finishWizard())
    ).toEqual(initialState);
  });
});
