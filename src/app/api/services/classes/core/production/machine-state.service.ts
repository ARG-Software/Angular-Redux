import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";
import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { IMachineStateService } from "../../../interfaces/core/production/imachine-state.service";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "src/app/features/production/models/machine-state.model";

@Injectable()
export class MachineStateService
  extends BaseMimsApi
  implements IMachineStateService
{
  private controllerRoute = "Machine-State";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public fetchMachineData(
    machineId: number
  ): Observable<MachineStateLoadDataModelUI[]> {
    return this.getObjects(`${this.controllerRoute}/${machineId}`);
  }

  public updateMachine(obj: MachineStateSaveDataModelUI): Observable<any> {
    return this.updateObject(obj, `${this.controllerRoute}`);
  }
}
