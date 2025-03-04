import { Observable } from "rxjs";
import { IMoteDto } from "src/app/api/models/apimodels";
export abstract class IMoteService {
  public abstract GetMotesofProduct(productId: number): Observable<IMoteDto[]>;
  public abstract AddMote(mote: IMoteDto): Observable<IMoteDto>;
  public abstract DeleteMote(moteId: number): Observable<boolean>;
}
