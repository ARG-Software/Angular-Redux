import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

import { KanbanDataModelUI } from "../../../models/settings.models";

@Component({
  standalone: false,
  selector: "kan-ban",
  templateUrl: "./kan-ban.component.html",
  styleUrls: ["./kan-ban.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanBanComponent implements OnChanges {
  @Input() public kanBanData: KanbanDataModelUI[] = [];
  @Output() public kanBanDataEmitter = new EventEmitter();

  protected kanBanForm!: FormGroup;

  public constructor(private formbuilder: FormBuilder) {
    this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["kanBanData"] && changes["kanBanData"].currentValue) {
      this.setKanBanDataToForm(this.kanBanData);
    }
  }

  /**
   * Getter to return the FormArray for "kanBan"
   */
  get kanBanControls(): FormArray {
    return this.kanBanForm.get("kanBan") as FormArray;
  }

  /**
   * Create the structure for kanban Form
   */
  private createForm() {
    this.kanBanForm = this.formbuilder.group({
      kanBan: this.formbuilder.array([]),
    });
  }

  /**
   * Add kanban data into kanBanForm in order to fulfill the html form
   */
  private setKanBanDataToForm(kanBanInfo: any[]) {
    const kanBanFormGroup = kanBanInfo.map((kanBan) =>
      this.formbuilder.group(kanBan)
    );
    const kanBanFormArray = this.formbuilder.array(kanBanFormGroup);
    this.kanBanForm.setControl("kanBan", kanBanFormArray);
  }

  public saveNewKanBanData() {
    this.kanBanDataEmitter.emit(this.kanBanForm.value.kanBan);
  }
}
