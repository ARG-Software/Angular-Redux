import { IBufferDto } from "src/app/api/models/apimodels";
import {
  WipDataModelUI,
  KanbanDataModelUI,
} from "../../../../features/products/models/settings.models";
import { Observable } from "rxjs";

export abstract class ISettingsService {
  public abstract GetBuffersForProduct(
    productId: number
  ): Observable<IBufferDto[]>;

  public abstract UpdateWip(wipData: WipDataModelUI[]): Observable<boolean>;

  public abstract UpdateKanBan(
    kanbanData: KanbanDataModelUI[]
  ): Observable<boolean>;

  public abstract UpdateDowntimeForProduct(
    productId: number,
    downtimeInMinutes: number
  ): Observable<boolean>;
}
