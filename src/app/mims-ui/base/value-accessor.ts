import { Directive, Input } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Directive()
export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  private _value: T = {} as T;

  public get value(): T {
    return this._value;
  }

  @Input()
  public set value(v: T) {
    this._value = v;
    if (!(typeof v === "boolean")) {
      this.propagateChange(this.value);
    }
  }

  /**
   * Write a new value to the element.
   */
  public writeValue(value: T): void {
    if (value !== undefined) {
      this._value = value;
    }
  }

  /**
   * Set the function to be called when the control receives a change event.
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Set the function to be called when the control receives a touch event.
   */
  public registerOnTouched(fn: any): void {
    // throw new DOMException('Not Implemented');
  }

  protected propagateChange: (_: any) => void = (_?: any) => {
    // throw new DOMException('Not Implemented');
  };
}
