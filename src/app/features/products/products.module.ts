import { ClarityModule } from "@clr/angular";
import { OverviewComponent } from "./containers/overview/overview.component";
import { ProductsComponent } from "./products.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SettingsComponent } from "./containers/settings/settings.component";
import { WipComponent } from "./components/settings/wip/wip.component";
import { KanBanComponent } from "./components/settings/kan-ban/kan-ban.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { reducerName, reducers } from "./products.reducers.index";
import { OverviewEffects } from "./effects/overview.effects";
import { SettingsEffects } from "./effects/settings.effects";
import { EffectsModule } from "@ngrx/effects";
import { ConfigureComponent } from "./containers/configure/configure.component";
import { ProductWizardComponent } from "./components/configure/product-wizard/product-wizard.component";
import { MachineWizardComponent } from "./components/configure/machine-wizard/machine-wizard.component";
import { SensorWizardComponent } from "./components/configure/sensors-wizard/sensors-wizard.component";
import { MoteWizardComponent } from "./components/configure/motes-wizard/motes-wizard.component";
import { OperationsWizardComponent } from "./components/configure/operations-wizard/operations-wizard.component";
import { ConfigureProductEffects } from "./effects/configure/product.effects";
import { ConfigureOperationsEffects } from "./effects/configure/operations.effects";
import { ConfigureMachinesOperationEffects } from "./effects/configure/machineop.effects";
import { ConfigureMotesEffects } from "./effects/configure/motes.effects";
import { ConfigureSelectBoxEffects } from "./effects/configure/selectbox.effects";
import { ConfigureSensorsEffects } from "./effects/configure/sensors.effects";
import { ResumeWizardComponent } from "./components/configure/resume-wizard/resume-wizard.component";
import { MimsUIModule } from "src/app/mims-ui/mims-ui.module";

const ProductsRoutingModule = RouterModule.forChild([
  { path: "settings", component: SettingsComponent },
  { path: "overview", component: OverviewComponent },
  { path: "configure", component: ConfigureComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MimsUIModule,
    ProductsRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(reducerName, reducers),
    EffectsModule.forFeature([
      OverviewEffects,
      SettingsEffects,
      ConfigureProductEffects,
      ConfigureOperationsEffects,
      ConfigureMachinesOperationEffects,
      ConfigureMotesEffects,
      ConfigureSensorsEffects,
      ConfigureSelectBoxEffects,
    ]),
  ],
  declarations: [
    MachineWizardComponent,
    ConfigureComponent,
    ProductWizardComponent,
    SensorWizardComponent,
    MoteWizardComponent,
    OperationsWizardComponent,
    ProductsComponent,
    ResumeWizardComponent,
    SettingsComponent,
    OverviewComponent,
    WipComponent,
    KanBanComponent,
  ],
})
export class ProductsModule {}
