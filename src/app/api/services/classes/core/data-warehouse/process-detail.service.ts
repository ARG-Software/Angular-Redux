import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IProcessDetailMachiningService } from "../../../interfaces/core/data-warehouse/iprocess-detail.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";

@Injectable()
export class ProcessDetailMachiningService
  extends BaseMimsApi
  implements IProcessDetailMachiningService
{
  private controllerRoute = "Process-Detail";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public GetProcessDetailData(obj: any): Observable<any> {
    return this.getObjectUsingQueryingObjectPOST(obj, this.controllerRoute);
  }
}
