import {
  Component,
  forwardRef,
  Optional,
  Inject,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from "@angular/forms";
import { BaseControlComponent } from "../../base/base.component";

@Component({
  standalone: false,
  selector: "mims-date-picker",
  templateUrl: "./date-picker.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent extends BaseControlComponent<Date> {
  @Output() public dateChanged = new EventEmitter<Date>();
  protected model: NgModel;
  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: any[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]
  ) {
    super(validators, asyncValidators);
  }

  public dateChange(newDate: Date) {
    this.value = newDate;
    this.dateChanged.emit(newDate);
  }
}
