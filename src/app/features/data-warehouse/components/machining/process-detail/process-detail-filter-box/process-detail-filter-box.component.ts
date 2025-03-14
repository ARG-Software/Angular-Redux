import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MachiningFilterModelUI } from "../../../../models/downtime.models";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "process-detail-filter-box",
  templateUrl: "process-detail-filter-box.component.html",
  styleUrls: ["./process-detail-filter-box.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessDetailFilterBoxComponent implements OnChanges {
  @Input() public machineSelectBoxData: MimsSelectBoxModel[] = [];
  @Input() public defaultFilters!: MachiningFilterModelUI;

  @Output() public OnFilterApply: EventEmitter<any> = new EventEmitter();

  protected processDetailForm!: FormGroup;

  public constructor(private formbuilder: FormBuilder) {
    this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes["defaultFilters"]) {
      if (changes["defaultFilters"].isFirstChange()) {
        this.processDetailForm = this.formbuilder.group({
          Machine: new FormControl(""),
          StartDate: new FormControl(this.defaultFilters.StartDate),
        });
      }
    }
  }

  /**
   * Create the structure for filter Form
   */
  private createForm() {
    this.processDetailForm = this.formbuilder.group({
      Machine: new FormControl(""),
      StartDate: new FormControl(""),
    });
  }

  public submitFilters() {
    this.OnFilterApply.emit(this.processDetailForm.value);
  }
}
