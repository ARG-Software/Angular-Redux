import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IMachineStateService } from "../../../interfaces/core/production/imachine-state.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";

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

  public GetMachineStateData(obj: any): Observable<any> {
    return this.getObjectByParams(this.controllerRoute, obj);
  }

  public UpdateMachineStateData(obj: any): Observable<any> {
    return this.updateObject(obj, `${this.controllerRoute}`);
  }
}
