import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Optional,
  Inject,
  ViewEncapsulation,
  Input,
  OnInit,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NgModel,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from "@angular/forms";
import { BaseControlComponent } from "../../base/base.component";

@Component({
  standalone: false,
  selector: "mims-input",
  templateUrl: "./input.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends BaseControlComponent<string> {
  @Input() public rows: string;
  @Input() public cols: string;
  protected model: NgModel;
  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: any[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]
  ) {
    super(validators, asyncValidators);
  }

  public setFullWidthStyleIfRequired(): any {
    if (this.size !== null) {
      const fullWidthStyle = {
        width: "100%",
      };
      return fullWidthStyle;
    }
  }
}
