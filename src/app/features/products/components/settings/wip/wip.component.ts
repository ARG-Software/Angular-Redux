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
import { WipDataModelUI } from "../../../models/settings.models";

@Component({
  standalone: false,
  selector: "wip",
  templateUrl: "./wip.component.html",
  styleUrls: ["./wip.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WipComponent implements OnChanges {
  @Input() public wipData: WipDataModelUI[];
  @Output() public wipDataEmitter = new EventEmitter();

  protected wipForm: FormGroup;

  public constructor(private formbuilder: FormBuilder) {
    this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["wipData"].currentValue) {
      this.setWipDataToForm(this.wipData);
    }
  }

  /**
   * Create the structure for wip Form
   */
  private createForm() {
    this.wipForm = this.formbuilder.group({
      wip: this.formbuilder.array([]),
    });
  }

  /**
   * Add wip data into wipForm in order to fullfill the html form
   */
  private setWipDataToForm(wipInfo: any[]) {
    const wipFormGroup = wipInfo.map((wip) => this.formbuilder.group(wip));
    const wipFormArray = this.formbuilder.array(wipFormGroup);
    this.wipForm.setControl("wip", wipFormArray);
  }

  public saveNewWipData() {
    this.wipDataEmitter.emit(this.wipForm.value.wip);
  }

  get wipControls(): FormArray {
    return this.wipForm.get("wip") as FormArray;
  }
}
