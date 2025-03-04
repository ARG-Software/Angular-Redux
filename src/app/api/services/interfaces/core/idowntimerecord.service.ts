import { Observable } from "rxjs";
import { IShiftGraphicDto } from "src/app/api/models/apimodels";
export abstract class IDownTimeRecordService {
  public abstract getDowntimeOfProductShiftGraphic(
    productId: number,
    queryStartDate: Date
  ): Observable<IShiftGraphicDto[]>;
}
