import { Observable } from "rxjs";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "src/app/features/production/models/machine-state.model";

export abstract class IMachineStateService {
  public abstract fetchMachineData(
    machineId: number
  ): Observable<MachineStateLoadDataModelUI[]>;
  public abstract updateMachine(
    obj: MachineStateSaveDataModelUI
  ): Observable<any>;
}
