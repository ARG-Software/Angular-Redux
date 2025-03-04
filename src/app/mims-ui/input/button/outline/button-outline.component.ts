import { Component, Input } from "@angular/core";
import { ButtonBaseComponent } from "../base/button-base.component";

@Component({
  standalone: false,
  selector: "mims-button-outline",
  templateUrl: "./button-outline.component.html",
})
export class ButtonOutlineComponent extends ButtonBaseComponent {
  @Input() public buttontype: string;
}
