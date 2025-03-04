import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { MachineOperationModelUI } from "../../../models/configure.model";
import { MimsFormErrorsService } from "src/app/mims-ui/forms/wizard/services/errors.service";
import { MimsValidator } from "src/app/mims-ui/forms/wizard/services/validators";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "machine-wizard-page",
  templateUrl: "./machine-wizard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachineWizardComponent {
  @Input() public machineSelectBoxData: MimsSelectBoxModel[];
  @Input() public operationsSelectBoxData: MimsSelectBoxModel[];
  @Input() public machinesList: MachineOperationModelUI[];
  @Output() public addMachine = new EventEmitter();
  @Output() public removeMachine = new EventEmitter();
  public machinesForm: FormGroup;
  protected errors: any[] = [];

  public constructor(
    private formBuilder: FormBuilder,
    private formErrorService: MimsFormErrorsService
  ) {
    this.machinesForm = this.formBuilder.group({
      machine: new FormControl("", [MimsValidator.required]),
      operation: new FormControl("", [MimsValidator.required]),
      oee: new FormControl("", [
        MimsValidator.required,
        MimsValidator.min(1),
        MimsValidator.max(1000),
      ]),
      mde: new FormControl("", [
        MimsValidator.required,
        MimsValidator.isNumber,
        MimsValidator.min(1),
        MimsValidator.max(60),
      ]),
    });
  }
  protected get machine(): AbstractControl {
    return this.machinesForm.get("machine");
  }
  protected get operation(): AbstractControl {
    return this.machinesForm.get("operation");
  }
  protected get oee(): AbstractControl {
    return this.machinesForm.get("oee");
  }
  protected get mde(): AbstractControl {
    return this.machinesForm.get("mde");
  }
  protected get machineSelectedId(): number | string {
    const machineSelectedId = this.machinesForm.get("machine")
      .value as any as MimsSelectBoxModel;
    return machineSelectedId.value;
  }
  protected get operationSelectedId(): number | string {
    const machineSelectedId = this.machinesForm.get("operation")
      .value as any as MimsSelectBoxModel;
    return machineSelectedId.value;
  }

  protected onAddMachine(): void {
    if (!this.machinesForm.invalid) {
      const addedMachine: MachineOperationModelUI = {
        Id: 0,
        ProductId: undefined,
        MachineId: this.machineSelectedId as number,
        OperationId: this.operationSelectedId as number,
        OEE: this.oee.value as number,
        MDE: this.mde.value as number,
      };
      this.addMachine.emit(addedMachine);
      this.errors = [];
    } else {
      this.getFormErrors();
    }
  }

  protected onRemoveMachine(machine: MachineOperationModelUI): void {
    this.removeMachine.emit(machine);
  }

  private getFormErrors(): void {
    const formControlNameAlias = {
      machine: "Machines",
      operation: "Operations",
      oee: "OEE",
      mde: "MDE",
    };
    const errors = this.formErrorService.getFormGroupValidationErrors(
      this.machinesForm
    );
    this.errors = this.formErrorService.displayFormErrors(
      formControlNameAlias,
      errors
    );
  }
}
