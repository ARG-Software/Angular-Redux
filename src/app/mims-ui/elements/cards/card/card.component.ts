import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

// TODO: add icons
// TODO: for now is using solid button

@Component({
  standalone: false,
  selector: "mims-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() public title: string = "";
  @Input() public titleColour: string = "";
  @Input() public text: string = "";
  @Input() public textColour: string = "";
  @Input() public backgroundColour: string = "";

  @Input() public topRightTitle: string = "";
  @Input() public topRightTitleColor: string = "";

  @Input() public midRightTitle: string = "";
  @Input() public midRightTitleColor: string = "";

  @Input() public buttonText: string = "OK";
  @Input() public buttonSize: string = "";
  @Input() public buttonType: string = "success";
}
