import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MachiningFilterModelUI } from "../../../../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "oee-filter-box",
  templateUrl: "oee-filter-box.component.html",
  styleUrls: ["./oee-filter-box.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OeeFilterBoxComponent implements OnChanges {
  @Input() public machineSelectBoxData: MimsSelectBoxModel[];
  @Input() public productSelectBoxData: MimsSelectBoxModel[];
  @Input() public defaultFilters: MachiningFilterModelUI;

  @Output() public OnFilterApply: EventEmitter<any> = new EventEmitter();

  protected oeeForm: FormGroup;

  public constructor(private formbuilder: FormBuilder) {
    this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes["defaultFilters"]) {
      if (changes["defaultFilters"].isFirstChange()) {
        this.oeeForm = this.formbuilder.group({
          Machine: new FormControl(""),
          Product: new FormControl(""),
          StartDate: new FormControl(this.defaultFilters.StartDate),
          EndDate: new FormControl(this.defaultFilters.EndDate),
        });
      }
    }
  }

  /**
   * Create the structure for filter Form
   */
  private createForm() {
    this.oeeForm = this.formbuilder.group({
      Machine: new FormControl(""),
      Product: new FormControl(""),
      StartDate: new FormControl(""),
      EndDate: new FormControl(""),
    });
  }

  private submitFilters() {
    this.OnFilterApply.emit(this.oeeForm.value);
  }
}
