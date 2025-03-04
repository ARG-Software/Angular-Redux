import { Observable } from "rxjs";
import { IMachineOperationsDto } from "src/app/api/models/apimodels";
export abstract class IMachineOperationService {
  public abstract GetMachineOperationsofProduct(
    productId: number
  ): Observable<IMachineOperationsDto[]>;
  public abstract AddMachineOperation(
    machineOperation: IMachineOperationsDto
  ): Observable<IMachineOperationsDto>;
  public abstract DeleteMachineOperation(
    machineOperationId: number
  ): Observable<boolean>;
}
