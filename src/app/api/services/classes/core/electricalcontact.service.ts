import { BaseMimsApi } from "../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IElectricalContactDto } from "../../../models/apimodels";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";
import { IElectricalConcactService } from "../../interfaces/core/ielectricalcontact.service";

@Injectable()
export class ElectricalContactService
  extends BaseMimsApi
  implements IElectricalConcactService
{
  private controllerRoute = "ElectricalContact";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public AddEC(ec: IElectricalContactDto): Observable<IElectricalContactDto> {
    return this.insertObject(ec, `${this.controllerRoute}`);
  }

  public DeleteEC(ecId: number): Observable<boolean> {
    return this.deleteById(ecId, `${this.controllerRoute}`);
  }

  public GetECofProduct(ecId: number): Observable<IElectricalContactDto[]> {
    return this.getObjects(`${this.controllerRoute}/productId/${ecId}`);
  }
}
