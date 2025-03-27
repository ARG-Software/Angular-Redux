import {
  ProductModelUI,
  OperationModelUI,
  MachineOperationModelUI,
  MoteModelUI,
  SensorModelUI,
  ConfigureSelectBoxModelUI,
  ResumeConfigurationModelUI,
} from "../models/configure.model";
import { getDiferenceBetweenObjectArraysByProperty } from "../../../utils/funtion.utils";
import { createReducer, on } from "@ngrx/store";
import {
  getProductDetailsSuccess,
  saveProductDetailsSuccess,
  getOperationsSuccess,
  getOperationsSelectBoxSuccess,
  addOperationSuccess,
  removeOperationSuccess,
  getMachineOperationsSuccess,
  addMachineOperationSuccess,
  removeMachineOperationSuccess,
  getMotesSuccess,
  getMotesSelectBoxSuccess,
  addMoteSuccess,
  removeMoteSuccess,
  getSensorsSuccess,
  addSensorSuccess,
  removeSensorSuccess,
  getEdgesSelectBoxSuccess,
  getMessagesSelectBoxSuccess,
  getSubcontractorsSelectBoxSuccess,
  getMachineSelectBoxSuccess,
  finishWizard,
} from "../actions/configure.actions";
import { getResumePage } from "../actions/configure.actions";

export interface ConfigureState {
  machineSelectBox: ConfigureSelectBoxModelUI[];
  edgeSelectBox: ConfigureSelectBoxModelUI[];
  messageSelectBox: ConfigureSelectBoxModelUI[];
  motesSelectBox: ConfigureSelectBoxModelUI[];
  operationsSelectBox: ConfigureSelectBoxModelUI[];
  subcontractorsSelectBox: ConfigureSelectBoxModelUI[];
  productsPage: {
    productDetails: ProductModelUI;
  };
  operationsPage: {
    operations: OperationModelUI[];
    originalOperations: OperationModelUI[];
    needsUpdate: boolean;
  };
  machinesPage: {
    machines: MachineOperationModelUI[];
    originalMachines: MachineOperationModelUI[];
    needsUpdate: boolean;
  };
  motesPage: {
    motes: MoteModelUI[];
    originalMotes: MoteModelUI[];
    needsUpdate: boolean;
  };
  sensorsPage: {
    sensors: SensorModelUI[];
    originalSensors: SensorModelUI[];
    needsUpdate: boolean;
  };
  resumePage: ResumeConfigurationModelUI;
}

export const initialState: ConfigureState = {
  machineSelectBox: [],
  edgeSelectBox: [],
  messageSelectBox: [],
  motesSelectBox: [],
  operationsSelectBox: [],
  subcontractorsSelectBox: [],
  productsPage: {
    productDetails: {} as ProductModelUI,
  },
  operationsPage: {
    operations: [],
    originalOperations: [],
    needsUpdate: true,
  },
  machinesPage: {
    machines: [],
    originalMachines: [],
    needsUpdate: true,
  },
  motesPage: {
    motes: [],
    originalMotes: [],
    needsUpdate: true,
  },
  sensorsPage: {
    sensors: [],
    originalSensors: [],
    needsUpdate: true,
  },
  resumePage: {
    addedMachines: [],
    addedOperations: [],
    addedMotes: [],
    addedSensors: [],
    removedMachines: [],
    removedMotes: [],
    removedOperations: [],
    removedSensors: [],
  },
};

export const configureReducer = createReducer(
  initialState,

  // ─── Product ─────────────────────────────────────────────────────────────
  on(getProductDetailsSuccess, (state, { product }) => ({
    ...state,
    productsPage: {
      ...state.productsPage,
      productDetails: { ...product },
    },
  })),
  on(saveProductDetailsSuccess, (state, { product }) => ({
    ...state,
    productsPage: {
      ...state.productsPage,
      productDetails: {
        ...state.productsPage.productDetails,
        ...product,
      },
    },
  })),

  // ─── Operations ──────────────────────────────────────────────────────────
  on(getOperationsSuccess, (state, { operations }) => ({
    ...state,
    operationsPage: {
      ...state.operationsPage,
      operations,
      originalOperations:
        state.operationsPage.originalOperations.length > 0
          ? state.operationsPage.originalOperations
          : [...operations],
      needsUpdate: false,
    },
  })),
  on(getOperationsSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    operationsSelectBox: [...selectBox],
  })),
  on(addOperationSuccess, (state, { operation }) => ({
    ...state,
    operationsPage: {
      ...state.operationsPage,
      operations: [operation, ...state.operationsPage.operations],
    },
    operationsSelectBox: [
      {
        name: operation.Description,
        value: operation.Id,
        selected: false,
      },
      ...state.operationsSelectBox,
    ],
  })),
  on(removeOperationSuccess, (state, { operationId }) => ({
    ...state,
    operationsPage: {
      ...state.operationsPage,
      operations: state.operationsPage.operations.filter(
        (o) => o.Id !== operationId
      ),
    },
    operationsSelectBox: state.operationsSelectBox.filter(
      (s) => s.value !== operationId
    ),
  })),

  // ─── Machine Operations ──────────────────────────────────────────────────
  on(getMachineOperationsSuccess, (state, { machines }) => ({
    ...state,
    machinesPage: {
      ...state.machinesPage,
      machines,
      originalMachines:
        state.machinesPage.originalMachines.length > 0
          ? state.machinesPage.originalMachines
          : [...machines],
      needsUpdate: false,
    },
  })),
  on(addMachineOperationSuccess, (state, { machine }) => ({
    ...state,
    machinesPage: {
      ...state.machinesPage,
      machines: [machine, ...state.machinesPage.machines],
    },
  })),
  on(removeMachineOperationSuccess, (state, { id }) => ({
    ...state,
    machinesPage: {
      ...state.machinesPage,
      machines: state.machinesPage.machines.filter((m) => m.Id !== id),
    },
  })),

  // ─── Motes ───────────────────────────────────────────────────────────────
  on(getMotesSuccess, (state, { motes }) => ({
    ...state,
    motesPage: {
      ...state.motesPage,
      motes,
      originalMotes:
        state.motesPage.originalMotes.length > 0
          ? state.motesPage.originalMotes
          : [...motes],
      needsUpdate: false,
    },
  })),
  on(getMotesSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    motesSelectBox: [...selectBox],
  })),
  on(addMoteSuccess, (state, { mote }) => ({
    ...state,
    motesPage: {
      ...state.motesPage,
      motes: [mote, ...state.motesPage.motes],
    },
    motesSelectBox: [
      {
        name: mote.Name,
        value: mote.Id,
        selected: false,
      },
      ...state.motesSelectBox,
    ],
  })),
  on(removeMoteSuccess, (state, { moteId }) => ({
    ...state,
    motesPage: {
      ...state.motesPage,
      motes: state.motesPage.motes.filter((m) => m.Id !== moteId),
    },
    motesSelectBox: state.motesSelectBox.filter((m) => m.value !== moteId),
  })),

  // ─── Sensors ─────────────────────────────────────────────────────────────
  on(getSensorsSuccess, (state, { sensors }) => ({
    ...state,
    sensorsPage: {
      ...state.sensorsPage,
      sensors,
      originalSensors: [...sensors],
      needsUpdate: false,
    },
  })),
  on(addSensorSuccess, (state, { sensor }) => ({
    ...state,
    sensorsPage: {
      ...state.sensorsPage,
      sensors: [sensor, ...state.sensorsPage.sensors],
    },
  })),
  on(removeSensorSuccess, (state, { sensorId }) => ({
    ...state,
    sensorsPage: {
      ...state.sensorsPage,
      sensors: state.sensorsPage.sensors.filter((s) => s.Id !== sensorId),
    },
  })),

  // ─── Select Box ──────────────────────────────────────────────────────────
  on(getEdgesSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    edgeSelectBox: [...selectBox],
  })),
  on(getMessagesSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    messageSelectBox: [...selectBox],
  })),
  on(getSubcontractorsSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    subcontractorsSelectBox: [...selectBox],
  })),
  on(getMachineSelectBoxSuccess, (state, { selectBox }) => ({
    ...state,
    machineSelectBox: [...selectBox],
  })),

  // ─── Misc ────────────────────────────────────────────────────────────────
  on(finishWizard, () => ({
    ...initialState,
  })),
  on(getResumePage, (state) => ({
    ...state,
    resumePage: getResumePageData(state),
  }))
);

export const getConfigureState = (state: ConfigureState) => state;

export const getMachineSelectBoxData = (state: ConfigureState) =>
  state.machineSelectBox;

export const getEdgeSelectBoxData = (state: ConfigureState) =>
  state.edgeSelectBox;

export const getMotesSelectBoxData = (state: ConfigureState) =>
  state.motesSelectBox;

export const getSubContractorsSelectBoxData = (state: ConfigureState) =>
  state.subcontractorsSelectBox;

export const getOperationsSelectBoxData = (state: ConfigureState) =>
  state.operationsSelectBox;

export const getMessagesSelectBoxData = (state: ConfigureState) =>
  state.messageSelectBox;

export const getProductDetailData = (state: ConfigureState) =>
  state.productsPage.productDetails;

export const getOperationsDetailsData = (state: ConfigureState) =>
  state.operationsPage.operations;

export const getOperationsUpdateStateData = (state: ConfigureState) =>
  state.operationsPage.needsUpdate;

export const getMachineOperationsDetailsData = (state: ConfigureState) =>
  state.machinesPage.machines;

export const getMachineOperationsUpdateStateData = (state: ConfigureState) =>
  state.machinesPage.needsUpdate;

export const getMotesDetailsData = (state: ConfigureState) =>
  state.motesPage.motes;

export const getMotesUpdateStateData = (state: ConfigureState) =>
  state.motesPage.needsUpdate;

export const getSensorsDetailsData = (state: ConfigureState) =>
  state.sensorsPage.sensors;

export const getSensorUpdateStateData = (state: ConfigureState) =>
  state.sensorsPage.needsUpdate;

export const getResumePageState = (state: ConfigureState) => state.resumePage;

export const getResumePageData = (
  state: ConfigureState
): ResumeConfigurationModelUI => {
  console.log(state);
  const addOperations = getDiferenceBetweenObjectArraysByProperty(
    state.operationsPage.operations,
    state.operationsPage.originalOperations,
    "Id"
  );
  const removeOperations = getDiferenceBetweenObjectArraysByProperty(
    state.operationsPage.originalOperations,
    state.operationsPage.operations,
    "Id"
  );
  const addMachines = getDiferenceBetweenObjectArraysByProperty(
    state.machinesPage.machines,
    state.machinesPage.originalMachines,
    "Id"
  );
  const removeMachines = getDiferenceBetweenObjectArraysByProperty(
    state.machinesPage.originalMachines,
    state.machinesPage.machines,
    "Id"
  );
  const addMotes = getDiferenceBetweenObjectArraysByProperty(
    state.motesPage.motes,
    state.motesPage.originalMotes,
    "Id"
  );
  const removeMotes = getDiferenceBetweenObjectArraysByProperty(
    state.motesPage.originalMotes,
    state.motesPage.motes,
    "Id"
  );
  const addSensors = getDiferenceBetweenObjectArraysByProperty(
    state.sensorsPage.sensors,
    state.sensorsPage.originalSensors,
    "Id"
  );
  const removeSensors = getDiferenceBetweenObjectArraysByProperty(
    state.sensorsPage.originalSensors,
    state.sensorsPage.sensors,
    "Id"
  );
  const resumePageModel: ResumeConfigurationModelUI = {
    addedOperations: [...addOperations],
    removedOperations: [...removeOperations],
    addedMachines: [...addMachines],
    removedMachines: [...removeMachines],
    addedMotes: [...addMotes],
    removedMotes: [...removeMotes],
    addedSensors: [...addSensors],
    removedSensors: [...removeSensors],
  };
  return resumePageModel;
};
