import { ClarityModule } from "@clr/angular";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { MachineStateInformationComponent } from "./components/machine-state/machine-state-information.component";
import { MachineStateComponent } from "./containers/machine-state/machine-state.component";
import { MachineStateEffects } from "./effects/machine-state.effects";

import { MessagingInformationComponent } from "./components/messaging/messaging-information.component";
import { MessagingComponent } from "./containers/messaging/messaging.component";
import { MessagingEffects } from "./effects/messaging.effects";
import { MimsUIModule } from "src/app/mims-ui/mims-ui.module";
import { MachineStateStore } from "./store/machine-state.store";
import { MessagingStore } from "./store/messaging.store";

const ProductionRoutingModule = RouterModule.forChild([
  { path: "machine-state", component: MachineStateComponent },
  { path: "messaging", component: MessagingComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MimsUIModule,
    ProductionRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([MachineStateEffects, MessagingEffects]),
  ],
  providers: [MachineStateStore, MessagingStore],
  declarations: [
    MachineStateInformationComponent,
    MachineStateComponent,
    MessagingInformationComponent,
    MessagingComponent,
  ],
})
export class ProductionModule {}
