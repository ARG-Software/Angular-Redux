import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { MessagingLoadDataModelUI } from "../../models/messaging.model";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "messaging-information",
  templateUrl: "./messaging-information.component.html",
  styleUrls: ["./messaging-information.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingInformationComponent {
  @Input() public buttonText: string;
  @Input() public messagingData: MessagingLoadDataModelUI[];

  @Output() public checkboxEmitter: EventEmitter<number> = new EventEmitter();
  @Output() public selectboxEmitter: EventEmitter<any> = new EventEmitter();
  @Output() public saveEmitter: EventEmitter<any> = new EventEmitter();

  /**
   * Emit check box information
   * @param info contains data: data passed to checkbox and checked: boolean
   */
  public checkboxChange(info: any) {
    this.checkboxEmitter.emit(info.data);
  }

  /**
   * Emit selected option and messaging Id
   * @param Option selected option
   * @param Id Id of the line
   */
  public selectboxChange(Option: MimsSelectBoxModel, Id: number) {
    this.selectboxEmitter.emit({
      Id,
      Option,
    });
  }

  /**
   * Emit that submit button was clicked!
   */
  private submitChanges() {
    this.saveEmitter.emit();
  }
}
