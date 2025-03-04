import { BaseMimsApi } from "../../classes/base/base.mims.api";
import { Injectable } from "@angular/core";
import { IOperationDto } from "../../../models/apimodels";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GlobalEnvironmentService } from "src/app/global.environment.service";
import { IOperationService } from "../../interfaces/core/ioperation.service";

@Injectable()
export class OperationService extends BaseMimsApi implements IOperationService {
  private controllerRoute = "Operations";

  constructor(
    protected http: HttpClient,
    protected serverSettings: GlobalEnvironmentService
  ) {
    super(http, serverSettings);
  }

  public AddOperation(operation: IOperationDto): Observable<IOperationDto> {
    return this.insertObject(operation, `${this.controllerRoute}/addOperation`);
  }

  public DeleteOperation(operationId: number): Observable<boolean> {
    return this.deleteById(operationId, `${this.controllerRoute}`);
  }

  public GetOperationsByProductId(
    productId: number
  ): Observable<IOperationDto[]> {
    return this.getObjects(`${this.controllerRoute}/productId/${productId}`);
  }
}
