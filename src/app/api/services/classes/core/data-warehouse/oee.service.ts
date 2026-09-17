import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IOeeMachiningService } from "../../../interfaces/core/data-warehouse/ioee.service";
import { IOEEScreenDto } from "../../../../models/apimodels";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GlobalEnvironmentService } from "src/app/global.environment.service";

@Injectable()
export class OeeMachiningService
  extends BaseMimsApi
  implements IOeeMachiningService
{
  private controllerRoute = "DataWarehouse/graphics/Oee";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public GetOeeData(obj: any): Observable<IOEEScreenDto> {
    return this.getObjectUsingQueryingObjectPOST(obj, this.controllerRoute);
  }
}
