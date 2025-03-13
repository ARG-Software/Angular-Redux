import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  ChangeDetectorRef,
  EventEmitter,
} from "@angular/core";
import { Subscription } from "rxjs";
import { CommonNavigationService } from "../common/services/navigation.service";
import { SideBarItemModel } from "./models/item.model";

@Component({
  standalone: false,
  selector: "mims-vertical-nav",
  templateUrl: "./vertical-nav.component.html",
  styleUrls: ["./vertical-nav.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavComponent implements OnInit {
  public menu: any[] = [];
  @Output() public navigate = new EventEmitter();
  @Input() public menuPath: string = "";
  private menuSubscription: Subscription = new Subscription();
  public constructor(
    private sideBarService: CommonNavigationService,
    private ref: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.menuSubscription = this.sideBarService
      .getMenu(this.menuPath)
      .subscribe(
        (menu) => {
          this.menu = menu;
          this.ref.markForCheck();
        },
        () => {
          this.menuSubscription.unsubscribe();
        }
      );
  }

  public onMenuClick(clickedElement: SideBarItemModel): void {
    this.navigate.emit(clickedElement.route);
  }
}
