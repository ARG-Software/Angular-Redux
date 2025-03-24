import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  standalone: false,
  selector: "mims-label",
  templateUrl: "./label.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  @Input() public text: string = "";
  @Input() public forId: string = "";
}
