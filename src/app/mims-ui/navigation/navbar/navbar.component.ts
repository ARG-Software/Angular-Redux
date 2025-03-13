import { NavBarContextItemModel } from "./models/navbar-context-item.model";
import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonNavigationService } from "../common/services/navigation.service";
import { EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { NavBarSettingsModel } from "./models/navbar-settings.model";

@Component({
  standalone: false,
  selector: "mims-navbar",
  templateUrl: "./navbar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  public contextMenu: NavBarContextItemModel[] = [];
  public settings: NavBarSettingsModel = { name: "", icon: "" };
  @Output() public navigate = new EventEmitter();
  @Input() public menuPath: string = "";
  private menuSubscription: Subscription = new Subscription();

  public constructor(
    private navbarService: CommonNavigationService,
    private ref: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.menuSubscription = this.navbarService.getMenu(this.menuPath).subscribe(
      (menu) => {
        this.settings = menu.settings;
        this.contextMenu = menu.contextMenu;
        this.ref.markForCheck();
      },
      () => {
        this.menuSubscription.unsubscribe();
      }
    );
  }
  public onContextMenuClick(clickedElement: NavBarContextItemModel): void {
    this.navigate.emit(clickedElement.url);
  }
}
