import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  KanbanDataModelUI,
  WipDataModelUI,
} from "../../models/settings.models";
import * as SettingsActions from "../../actions/settings.actions";
import * as fromReducer from "../../products.reducers.index";

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

  constructor(private store: Store<fromReducer.ProductState>) {
    this.wipData$ = this.store.select(fromReducer.getWip);
    this.kanBanData$ = this.store.select(fromReducer.getKanBan);
  }

  ngOnInit(): void {
    this.store.dispatch(
      SettingsActions.loadSettingsData({ productId: this.productId })
    );
  }

  saveWipData(data: WipDataModelUI[]): void {
    this.store.dispatch(SettingsActions.updateWip({ wip: data }));
  }

  saveKanBanData(data: KanbanDataModelUI[]): void {
    this.store.dispatch(SettingsActions.updateKanBan({ kanban: data }));
  }
}
