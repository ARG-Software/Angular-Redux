import { NgModel } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ValueAccessorBase } from "./value-accessor";
import { Directive, Input } from "@angular/core";

import {
  AsyncValidatorArray,
  ValidatorArray,
  ValidationResult,
  message,
  validate,
} from "./validations/validate-functions";

@Directive()
export abstract class BaseControlComponent<T> extends ValueAccessorBase<T> {
  @Input() public id: string;
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public type: string;
  @Input() public size: number;
  @Input() public disable: any;
  @Input() public name: string;
  @Input() public display: string;

  protected abstract model: NgModel;

  constructor(
    private validators: ValidatorArray,
    private asyncValidators: AsyncValidatorArray
  ) {
    super();
  }

  /*
   *  Method to validate controls.
   */
  protected validate(): Observable<ValidationResult> {
    return validate(
      this.validators,
      this.asyncValidators
    )(this.model.control).pipe(map((errors) => errors || {}));
  }

  /*
   *  Method to check if control is invalid.
   */
  protected get invalid(): Observable<boolean> {
    return this.validate().pipe(map((v) => Object.keys(v || {}).length > 0));
  }

  /*
   *  Method to show validation messages.
   */
  protected get failures(): Observable<string[]> {
    return this.validate().pipe(
      map((v) => Object.keys(v || {}).map((k) => message(v, k)))
    );
  }
}
