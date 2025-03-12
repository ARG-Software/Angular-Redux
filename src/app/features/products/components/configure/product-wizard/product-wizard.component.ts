import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { ProductModelUI } from "../../../models/configure.model";
import { MimsFormErrorsService } from "src/app/mims-ui/forms/wizard/services/errors.service";
import { MimsValidator } from "src/app/mims-ui/forms/wizard/services/validators";
import { AlertType } from "src/app/mims-ui/elements/alert/alert.component";

@Component({
  standalone: false,
  selector: "product-wizard-page",
  templateUrl: "./product-wizard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWizardComponent implements OnChanges {
  public productsForm: FormGroup;
  @Input() public productDetailsData: ProductModelUI;
  @Output() public updateProduct = new EventEmitter();
  public dangerType: AlertType = AlertType.DANGER;

  protected errors: any[] = [];
  protected get name(): AbstractControl {
    return this.productsForm.get("Name");
  }
  protected get targetHoursPerWeek(): AbstractControl {
    return this.productsForm.get("TargetHoursPerWeek");
  }
  protected get targetEfficiency(): AbstractControl {
    return this.productsForm.get("TargetEfficiency");
  }

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: MimsFormErrorsService
  ) {
    this.productsForm = this.formBuilder.group({
      Name: new FormControl("", [
        MimsValidator.required,
        MimsValidator.minLength(6),
      ]),
      TargetHoursPerWeek: new FormControl("", [
        MimsValidator.required,
        MimsValidator.isNumber,
        MimsValidator.max(80),
        MimsValidator.min(0),
      ]),
      TargetEfficiency: new FormControl("", [
        MimsValidator.required,
        MimsValidator.isNumber,
        MimsValidator.max(100),
        MimsValidator.min(0),
      ]),
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const productDetail =
      changes["productDetailsData"] !== null &&
      changes["productDetailsData"] !== undefined
        ? changes["productDetailsData"].currentValue
        : null;
    if (productDetail) {
      this.productsForm.patchValue(productDetail);
    }
  }

  protected onSaveProduct(): void {
    if (this.productsForm.invalid) {
      this.getFormErrors();
    } else {
      this.errors = [];
      const updatedProduct: ProductModelUI = {
        Id: 0,
        Name: this.name.value,
        TargetEfficiency: this.targetEfficiency.value,
        TargetHoursPerWeek: this.targetHoursPerWeek.value,
      };
      this.updateProduct.emit(updatedProduct);
    }
  }

  private getFormErrors(): void {
    const formControlNameAlias = {
      Name: "Name",
      TargetHoursPerWeek: "Target Hours Per Week",
      TargetEfficiency: "Target Efficiency",
    };
    const errors = this.formErrorService.getFormGroupValidationErrors(
      this.productsForm
    );
    this.errors = this.formErrorService.displayFormErrors(
      formControlNameAlias,
      errors
    );
  }
}
