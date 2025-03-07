import { Component, ChangeDetectionStrategy, Injector } from "@angular/core";
import { Store } from "@ngrx/store";
import { IAppConfig, APP_CONFIG } from "../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "../../../node_modules/rxjs";
import * as fromReducer from "./main.reducers.index";

/**
 * The Main Component
 */
@Component({
  standalone: false,
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  public readonly navbarPath: string;
  public readonly sideBarPath: string;
  private readonly appConfigurations: IAppConfig;

  public getLoading$: Observable<boolean>;

  public constructor(
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromReducer.MainState>
  ) {
    this.appConfigurations = this.injector.get(APP_CONFIG);
    this.navbarPath = this.appConfigurations.navbarPath;
    this.sideBarPath = this.appConfigurations.sideMenuPath;
    this.getLoading$ = this.store.select(fromReducer.getLoading);
  }
  public onNavigationBarClick(route: any) {
    this.router.navigate([route]);
  }

  public onVerticalMenuClick(route: any) {
    this.router.navigate([route], { relativeTo: this.route });
  }
}
