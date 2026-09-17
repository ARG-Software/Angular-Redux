import { BaseMimsApi } from "../../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IMessagingService } from "../../../interfaces/core/production/imessaging.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";

@Injectable()
export class MessagingService extends BaseMimsApi implements IMessagingService {
  private controllerRoute = "Messaging";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public GetMessagingData(obj: any): Observable<any> {
    return this.getObjectByParams(this.controllerRoute, obj);
  }

  public UpdateMessagingData(obj: any): Observable<any> {
    return this.updateObject(obj, `${this.controllerRoute}`);
  }
}
