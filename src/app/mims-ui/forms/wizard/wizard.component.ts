import {
  Component,
  ViewEncapsulation,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  TemplateRef,
} from "@angular/core";
import { ClrWizard } from "@clr/angular";
import { WizardPageModel } from "./models/wizard.models";

@Component({
  standalone: false,
  selector: "mims-wizard",
  templateUrl: "./wizard.component.html",
  styleUrls: ["./wizard.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent {
  @Output() public onWizardFinish = new EventEmitter();
  @Output() public onWizardPageChange = new EventEmitter();
  @Input() public disableNavigation: boolean = false;
  @Input() public orderedNavigation: boolean = true;
  @Input() public hasCancel: boolean = true;
  @Input() public hasBack: boolean = true;
  @Input() public wizardTitle: string;
  @Input() public wizardPageMetaData: WizardPageModel[];
  @Input() public wizardPageTemplate: Array<TemplateRef<any>>;
  @ViewChild("wizard") public wizard: ClrWizard;

  public navigateToNextPage(): void {
    this.wizard.next();
  }

  public navigateToFirstPage(): void {
    this.wizard.navService.setFirstPageCurrent();
  }

  public resetForm(): void {
    this.wizard.reset();
  }

  protected onFinish(_$event: any): void {
    this.onWizardFinish.emit();
  }

  protected onNext(_$event: any): void {
    const pageId = this.wizard.currentPage._id;
    this.onWizardPageChange.emit(pageId);
  }
}
