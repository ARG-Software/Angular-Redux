import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import {
  KanbanDataModelUI,
  WipDataModelUI,
} from "../../models/settings.models";
import { Store } from "@ngrx/store";
import * as fromReducer from "../../products.reducers.index";
import { Observable } from "rxjs";
import * as fromActions from "../../actions/settings.actions";

@Component({
  standalone: false,
  templateUrl: "settings.component.html",
  styleUrls: ["./settings.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private productId = 2;

  public wipData$: Observable<WipDataModelUI[]>;
  public kanBanData$: Observable<KanbanDataModelUI[]>;

  public constructor(private store: Store<fromReducer.ProductState>) {
    this.wipData$ = this.store.select(fromReducer.getWipData);
    this.kanBanData$ = this.store.select(fromReducer.getKanBanData);
  }

  public ngOnInit() {
    this.store.dispatch(new fromActions.LoadData(this.productId));
  }

  public saveWipData(data: WipDataModelUI[]) {
    this.store.dispatch(new fromActions.UpdateWip(data));
  }

  public saveKanBanData(data: KanbanDataModelUI[]) {
    this.store.dispatch(new fromActions.UpdateKanBan(data));
  }
}
