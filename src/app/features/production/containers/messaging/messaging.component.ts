import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { MessagingRequestModelUI } from "../../models/messaging.model";

import {
  getMessagingData,
  updateMessagingData,
} from "../../actions/messaging.actions";
import { MessagingStore } from "../../store/messaging.store";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  templateUrl: "messaging.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit {
  public header = {
    HeaderTitle: "Production",
    HeaderSubTitle: "Notifications",
    Color: "#5965e7",
  };

  public buttonText = "SUBMIT";

  private readonly store = inject(Store);
  private readonly messagingStore = inject(MessagingStore);

  public readonly messagingData = this.messagingStore.messagingData;
  public readonly messagingToSave = this.messagingStore.messagingToSave;

  private readonly request: MessagingRequestModelUI = {
    Id: 1,
  };

  public ngOnInit() {
    this.store.dispatch(getMessagingData({ payload: this.request }));
  }

  public checkboxChange(checkboxId: number) {
    this.messagingStore.toggleCheckbox(checkboxId);
  }

  public selectboxChange(data: { Id: number; Option: MimsSelectBoxModel }) {
    this.messagingStore.updateSelectBox(data.Id, data.Option);
  }

  public saveMessaging() {
    if (this.messagingToSave().length > 0) {
      this.store.dispatch(
        updateMessagingData({ payload: this.messagingToSave() })
      );
    }
  }
}
