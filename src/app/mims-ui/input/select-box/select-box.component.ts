import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Inject,
  Optional,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
} from "@angular/core";
import { MimsSelectBoxModel } from "./models/select-box.model";
import {
  NgModel,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { BaseControlComponent } from "../../base/base.component";

@Component({
  standalone: false,
  selector: "mims-select-box",
  templateUrl: "./select-box.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBoxComponent
  extends BaseControlComponent<MimsSelectBoxModel>
  implements OnChanges
{
  @Input() public data: MimsSelectBoxModel[];
  @Output() public changed = new EventEmitter<MimsSelectBoxModel>();
  protected model: NgModel;
  protected selected: string | number | undefined;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: any[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[],
    private ref: ChangeDetectorRef
  ) {
    super(validators, asyncValidators);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.data.map((ele) => {
        if (ele.selected === true) {
          this.value = ele;
          this.selected = ele.value;
        }
      });
    }
  }

  public onSelectValue(selectedValue: number) {
    const selectedItem = this.data.find((elem) => {
      // tslint:disable-next-line:triple-equals
      return elem.value == selectedValue;
    }) as MimsSelectBoxModel;
    this.value = selectedItem;
    this.changed.emit(selectedItem);
  }
}
