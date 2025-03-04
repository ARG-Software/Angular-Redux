import { BaseMimsApi } from "../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IMoteDto } from "../../../models/apimodels";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";
import { IMoteService } from "../../interfaces/core/imote.service";

@Injectable()
export class MoteService extends BaseMimsApi implements IMoteService {
  private controllerRoute = "Mote";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public AddMote(mote: IMoteDto): Observable<IMoteDto> {
    return this.insertObject(mote, `${this.controllerRoute}`);
  }

  public DeleteMote(moteId: number): Observable<boolean> {
    return this.deleteById(moteId, `${this.controllerRoute}`);
  }

  public GetMotesofProduct(moteId: number): Observable<IMoteDto[]> {
    return this.getObjects(`${this.controllerRoute}/productId/${moteId}`);
  }
}
