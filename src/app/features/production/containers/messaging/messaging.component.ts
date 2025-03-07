import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import {
  MessagingLoadDataModelUI,
  MessagingRequestModelUI,
  MessagingSaveDataModelUI,
} from "../../models/messaging.model";

import * as fromReducer from "../../production.reducers.index";
import * as fromActions from "../../actions/messaging.actions";

@Component({
  standalone: false,
  templateUrl: "messaging.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit, OnDestroy {
  public header = {
    HeaderTitle: "Production",
    HeaderSubTitle: "Notifications",
    Color: "#5965e7",
  };

  public buttonText = "SUBMIT";

  public messagingToSave: MessagingSaveDataModelUI[] = [];
  public messagingData$: Observable<MessagingLoadDataModelUI[]>;
  public _messagingToSave$: Subscription;

  private request: MessagingRequestModelUI = {
    Id: 1,
  };

  public constructor(private store: Store<fromReducer.ProductionState>) {
    this.messagingData$ = this.store.select(fromReducer.getMessagingData);
    this._messagingToSave$ = this.store
      .select(fromReducer.getMessagingToSave)
      .subscribe((toSave) => (this.messagingToSave = toSave));
  }

  public ngOnInit() {
    this.store.dispatch(new fromActions.GetMessagingData(this.request));
  }

  public ngOnDestroy() {
    this._messagingToSave$.unsubscribe();
  }

  /**
   * Dispatch action to save checked object
   * @param checkboxId Id from the checked object
   */
  public checkboxChange(checkboxId: number) {
    this.store.dispatch(new fromActions.ChangeCheckbox(checkboxId));
  }

  /**
   * Dispatch action to update select box changes
   * @param data information with Id and the new selected option
   */
  public selectboxChange(data: any) {
    this.store.dispatch(new fromActions.ChangeSelectbox(data));
  }

  /**
   * Dispatch action to save messaging changes
   */
  public saveMessaging() {
    if (this.messagingToSave.length > 0) {
      this.store.dispatch(
        new fromActions.UpdateMessagingData(this.messagingToSave)
      );
    }
  }
}
