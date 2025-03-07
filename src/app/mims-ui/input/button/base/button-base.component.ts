import { Directive, Input } from "@angular/core";

@Directive()
export abstract class ButtonBaseComponent {
  @Input() public id: string;
  @Input() public value: string;
}
