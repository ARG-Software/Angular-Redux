import { BaseMimsApi } from "../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IEdgeDto } from "../../../models/apimodels";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";
import { IEdgeService } from "../../interfaces/core/iedge.service";

@Injectable()
export class EdgeService extends BaseMimsApi implements IEdgeService {
  private controllerRoute = "Edge";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public GetEdges(): Observable<IEdgeDto[]> {
    return this.getObjects(`${this.controllerRoute}`);
  }
}
