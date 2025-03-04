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
  OperationModelUI,
  ConfigureSelectBoxModelUI,
  SubcontractorModelUI,
} from "../../../models/configure.model";
import { MimsFormErrorsService } from "src/app/mims-ui/forms/wizard/services/errors.service";
import { MimsValidator } from "src/app/mims-ui/forms/wizard/services/validators";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Component({
  standalone: false,
  selector: "operations-wizard-page",
  templateUrl: "./operations-wizard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsWizardComponent {
  @Input() public operationsList: OperationModelUI[];
  @Input() public subcontractorSelectBoxData: ConfigureSelectBoxModelUI[];
  @Output() public addOperation = new EventEmitter();
  @Output() public removeOperation = new EventEmitter();
  public operationForm: FormGroup;

  protected errors: any[] = [];

  protected get opNumber(): AbstractControl {
    return this.operationForm.get("opNumber");
  }
  protected get description(): AbstractControl {
    return this.operationForm.get("description");
  }
  protected get subcontractor(): AbstractControl {
    return this.operationForm.get("subcontractor");
  }
  protected get subcontractorCovertedToModel(): SubcontractorModelUI {
    const subcontractorSelected = this.operationForm.get("subcontractor")
      .value as any as MimsSelectBoxModel;
    const subContractorConvertedModel: SubcontractorModelUI = {
      Id: subcontractorSelected.value as number,
      Name: subcontractorSelected.name,
    };
    return subContractorConvertedModel;
  }

  public constructor(
    private formBuilder: FormBuilder,
    private formErrorService: MimsFormErrorsService
  ) {
    this.operationForm = this.formBuilder.group({
      opNumber: new FormControl("", [
        MimsValidator.required,
        MimsValidator.isNumber,
        MimsValidator.min(1),
        MimsValidator.max(99),
      ]),
      description: new FormControl("", [
        MimsValidator.required,
        MimsValidator.min(10),
      ]),
      subcontractor: new FormControl(""),
    });
  }

  protected onAddOperation(): void {
    if (!this.operationForm.invalid) {
      const addedOperation: OperationModelUI = {
        Id: 0,
        ProductId: undefined,
        Description: this.description.value as string,
        Number: this.opNumber.value as number,
        Subcontractor: this
          .subcontractorCovertedToModel as SubcontractorModelUI,
      };
      this.addOperation.emit(addedOperation);
      // this.resetFormFields();
      this.errors = [];
    } else {
      this.getFormErrors();
    }
  }

  protected onRemoveOperation(operation: OperationModelUI): void {
    this.removeOperation.emit(operation);
  }
  private getFormErrors(): void {
    const formControlNameAlias = {
      opNumber: "Op Num",
      description: "Description",
      subcontractor: "SubContractor",
    };
    const errors = this.formErrorService.getFormGroupValidationErrors(
      this.operationForm
    );
    this.errors = this.formErrorService.displayFormErrors(
      formControlNameAlias,
      errors
    );
  }

  private resetFormFields(): void {
    this.description.reset();
    this.description.setValue("");
    this.opNumber.reset();
    this.opNumber.setValue("");
    this.subcontractor.reset();
    this.subcontractor.setValue("");
  }
}
