import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ResumeConfigurationModelUI } from "../../../models/configure.model";

@Component({
  standalone: false,
  selector: "resume-wizard",
  templateUrl: "./resume-wizard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeWizardComponent {
  @Input() public resumeData!: ResumeConfigurationModelUI;
}
