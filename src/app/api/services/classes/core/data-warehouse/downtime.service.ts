import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IDownTimeMachiningService } from "../../../interfaces/core/data-warehouse/idowntime.service";
import { IMachineDowntimeScreenDto } from "../../../../models/apimodels";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GlobalEnvironmentService } from "src/app/global.environment.service";

@Injectable()
export class DowntimeMachiningService
  extends BaseMimsApi
  implements IDownTimeMachiningService
{
  //TODO change _ to /
  private controllerRoute = "DataWarehouse_graphics";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public GetDownTimeData(obj: any): Observable<IMachineDowntimeScreenDto> {
    return this.getObjectUsingQueryingObjectPOST(
      obj,
      `${this.controllerRoute}_DowntimePareto` //TODO change _ to /
    );
  }
}
