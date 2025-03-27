import { createAction, props } from "@ngrx/store";
import {
  ProductModelUI,
  OperationModelUI,
  MachineOperationModelUI,
  MoteModelUI,
  SensorModelUI,
  ConfigureSelectBoxModelUI,
} from "../models/configure.model";

// ─── Product Actions ──────────────────────────────────────────────────────────────

export const getProductDetails = createAction(
  "[Configure/Product] Get Product Details",
  props<{ productId: number }>()
);

export const getProductDetailsSuccess = createAction(
  "[Configure/Product] Get Product Details Success",
  props<{ product: ProductModelUI }>()
);

export const saveProductDetails = createAction(
  "[Configure/Product] Save Product Details",
  props<{ product: ProductModelUI }>()
);

export const saveProductDetailsSuccess = createAction(
  "[Configure/Product] Save Product Details Success",
  props<{ product: ProductModelUI }>()
);

export const productConfigurationError = createAction(
  "[Configure/Product] Configuration Error",
  props<{ error: any }>()
);

// ─── Operation Actions ────────────────────────────────────────────────────────────

export const getOperations = createAction(
  "[Configure/Operation] Get Operations",
  props<{ productId: number }>()
);

export const getOperationsSuccess = createAction(
  "[Configure/Operation] Get Operations Success",
  props<{ operations: OperationModelUI[] }>()
);

export const getOperationsSelectBoxSuccess = createAction(
  "[Configure/Operation] Get Operations SelectBox Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const addOperation = createAction(
  "[Configure/Operation] Add Operation",
  props<{ operation: OperationModelUI }>()
);

export const addOperationSuccess = createAction(
  "[Configure/Operation] Add Operation Success",
  props<{ operation: OperationModelUI }>()
);

export const removeOperation = createAction(
  "[Configure/Operation] Remove Operation",
  props<{ operationId: number }>()
);

export const removeOperationSuccess = createAction(
  "[Configure/Operation] Remove Operation Success",
  props<{ operationId: number }>()
);

export const operationConfigurationError = createAction(
  "[Configure/Operation] Configuration Error",
  props<{ error: any }>()
);

// ─── Machine Operation Actions ────────────────────────────────────────────────────

export const getMachineOperations = createAction(
  "[Configure/MachineOp] Get Machine Operations",
  props<{ productId: number }>()
);

export const getMachineOperationsSuccess = createAction(
  "[Configure/MachineOp] Get Machine Operations Success",
  props<{ machines: MachineOperationModelUI[] }>()
);

export const addMachineOperation = createAction(
  "[Configure/MachineOp] Add Machine Operation",
  props<{ machine: MachineOperationModelUI }>()
);

export const addMachineOperationSuccess = createAction(
  "[Configure/MachineOp] Add Machine Operation Success",
  props<{ machine: MachineOperationModelUI }>()
);

export const removeMachineOperation = createAction(
  "[Configure/MachineOp] Remove Machine Operation",
  props<{ id: number }>()
);

export const removeMachineOperationSuccess = createAction(
  "[Configure/MachineOp] Remove Machine Operation Success",
  props<{ id: number }>()
);

export const machineOperationFailure = createAction(
  "[Configure/MachineOp] Machine Operation Failure",
  props<{ error: any }>()
);

// ─── Motes Actions ────────────────────────────────────────────────────────────────

export const getMotes = createAction(
  "[Configure/Motes] Get Motes",
  props<{ productId: number }>()
);

export const getMotesSuccess = createAction(
  "[Configure/Motes] Get Motes Success",
  props<{ motes: MoteModelUI[] }>()
);

export const addMote = createAction(
  "[Configure/Motes] Add Mote",
  props<{ mote: MoteModelUI }>()
);

export const addMoteSuccess = createAction(
  "[Configure/Motes] Add Mote Success",
  props<{ mote: MoteModelUI }>()
);

export const removeMote = createAction(
  "[Configure/Motes] Remove Mote",
  props<{ moteId: number }>()
);

export const removeMoteSuccess = createAction(
  "[Configure/Motes] Remove Mote Success",
  props<{ moteId: number }>()
);

export const getMotesSelectBoxSuccess = createAction(
  "[Configure/Motes] Get Motes SelectBox Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const motesConfigurationError = createAction(
  "[Configure/Motes] Configuration Error",
  props<{ error: any }>()
);

// ─── Sensors Actions ──────────────────────────────────────────────────────────────

export const getSensors = createAction(
  "[Configure/Sensors] Get Sensors",
  props<{ productId: number }>()
);

export const getSensorsSuccess = createAction(
  "[Configure/Sensors] Get Sensors Success",
  props<{ sensors: SensorModelUI[] }>()
);

export const addSensor = createAction(
  "[Configure/Sensors] Add Sensor",
  props<{ sensor: SensorModelUI }>()
);

export const addSensorSuccess = createAction(
  "[Configure/Sensors] Add Sensor Success",
  props<{ sensor: SensorModelUI }>()
);

export const removeSensor = createAction(
  "[Configure/Sensors] Remove Sensor",
  props<{ sensorId: number }>()
);

export const removeSensorSuccess = createAction(
  "[Configure/Sensors] Remove Sensor Success",
  props<{ sensorId: number }>()
);

export const sensorConfigurationError = createAction(
  "[Configure/Sensor] Configuration Error",
  props<{ error: any }>()
);

// ─── Select Box Actions ───────────────────────────────────────────────────────────

export const getEdgesSelectBox = createAction(
  "[Configure/SelectBox] Get Edges Select Box"
);
export const getEdgesSelectBoxSuccess = createAction(
  "[Configure/SelectBox] Get Edges Select Box Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const getMessagesSelectBox = createAction(
  "[Configure/SelectBox] Get Messages Select Box"
);
export const getMessagesSelectBoxSuccess = createAction(
  "[Configure/SelectBox] Get Messages Select Box Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const getMachineSelectBox = createAction(
  "[Configure/SelectBox] Get Machine Select Box"
);
export const getMachineSelectBoxSuccess = createAction(
  "[Configure/SelectBox] Get Machine Select Box Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const getSubcontractorsSelectBox = createAction(
  "[Configure/SelectBox] Get Subcontractors Select Box"
);
export const getSubcontractorsSelectBoxSuccess = createAction(
  "[Configure/SelectBox] Get Subcontractors Select Box Success",
  props<{ selectBox: ConfigureSelectBoxModelUI[] }>()
);

export const selectBoxConfigurationError = createAction(
  "[Configure/SelectBox] Configuration Error",
  props<{ error: any }>()
);

// ─── Miscellaneous ────────────────────────────────────────────────────────────────

export const getResumePage = createAction(
  "[Configure] Get Resume Page",
  props<{ payload: any }>()
);

export const noNeedToUpdate = createAction("[Configure] No Update Needed");

export const finishWizard = createAction("[Configure] Finish Wizard");

export const errorConfiguration = createAction(
  "[Configure] Configuration Error",
  props<{ error: any }>()
);
