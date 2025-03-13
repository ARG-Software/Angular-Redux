import { Component, Input } from "@angular/core";
import { ButtonBaseComponent } from "../base/button-base.component";

@Component({
  standalone: false,
  selector: "mims-button-icon",
  templateUrl: "./button-icon.component.html",
})
export class ButtonIconComponent extends ButtonBaseComponent {
  @Input() public icon: string = "";
}
