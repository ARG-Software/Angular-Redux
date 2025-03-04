import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import {
  MoteModelUI,
  ConfigureSelectBoxModelUI,
} from "../../../models/configure.model";
import { MimsFormErrorsService } from "src/app/mims-ui/forms/wizard/services/errors.service";
import { MimsValidator } from "src/app/mims-ui/forms/wizard/services/validators";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "mote-wizard-page",
  templateUrl: "./motes-wizard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoteWizardComponent {
  @Input() public motesList: MoteModelUI[];
  @Input() public machineSelectBoxData: ConfigureSelectBoxModelUI[];
  @Input() public edgeSelectBoxData: ConfigureSelectBoxModelUI[];
  @Output() public addMote = new EventEmitter();
  @Output() public removeMote = new EventEmitter();

  public motesForm: FormGroup;
  protected errors: any[] = [];

  protected get machine(): AbstractControl {
    return this.motesForm.get("machine");
  }
  protected get name(): AbstractControl {
    return this.motesForm.get("name");
  }
  protected get edge(): AbstractControl {
    return this.motesForm.get("edge");
  }
  protected get pollInterval(): AbstractControl {
    return this.motesForm.get("pollInterval");
  }
  protected get machineId(): number {
    const selectedMachine = this.motesForm.get("machine")
      .value as any as MimsSelectBoxModel;
    return selectedMachine.value as number;
  }
  protected get edgeId(): number {
    const selectedEdge = this.motesForm.get("edge")
      .value as any as MimsSelectBoxModel;
    return selectedEdge.value as number;
  }

  public constructor(
    private formBuilder: FormBuilder,
    private formErrorService: MimsFormErrorsService
  ) {
    this.motesForm = this.formBuilder.group({
      name: new FormControl("", [
        MimsValidator.required,
        MimsValidator.min(1),
        MimsValidator.max(30),
      ]),
      machine: new FormControl("", [MimsValidator.required]),
      edge: new FormControl("", [MimsValidator.required]),
      pollInterval: new FormControl("", [
        MimsValidator.required,
        MimsValidator.isNumber,
        MimsValidator.min(1),
      ]),
    });
  }

  public onAddMote(): void {
    if (!this.motesForm.invalid) {
      const addedMote: MoteModelUI = {
        Id: 0,
        ProductId: undefined,
        MachineId: this.machineId,
        Name: this.name.value as string,
        EdgeId: this.edgeId,
        PollInterval: this.pollInterval.value as number,
      };
      this.addMote.emit(addedMote);
      this.errors = [];
    } else {
      this.getFormErrors();
    }
  }

  public onRemoveMote(mote: MoteModelUI): void {
    this.removeMote.emit(mote);
  }

  private getFormErrors(): void {
    const formControlNameAlias = {
      name: "Mote Name",
      machine: "Machine",
      edge: "Edge",
      pollInterval: "Poll Interval",
    };
    const errors = this.formErrorService.getFormGroupValidationErrors(
      this.motesForm
    );
    this.errors = this.formErrorService.displayFormErrors(
      formControlNameAlias,
      errors
    );
  }
}
