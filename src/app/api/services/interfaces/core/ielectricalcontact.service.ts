import { Observable } from "rxjs";
import { IElectricalContactDto } from "src/app/api/models/apimodels";
export abstract class IElectricalConcactService {
  public abstract GetECofProduct(
    productId: number
  ): Observable<IElectricalContactDto[]>;
  public abstract AddEC(
    ec: IElectricalContactDto
  ): Observable<IElectricalContactDto>;
  public abstract DeleteEC(ecId: number): Observable<boolean>;
}
