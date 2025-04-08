import { ClarityModule } from "@clr/angular";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { DataWarehouseComponent } from "./data-warehouse.component";

import { DowntimeComponent } from "./containers/machining/downtime/downtime.component";
import { OeeComponent } from "./containers/machining/oee/oee.component";
import { ProcessDetailComponent } from "./containers/machining/process-detail/process-detail.component";

import { DowntimeInformationComponent } from "./components/machining/downtime/downtime-information/downtime-information.component";
import { OeeInformationComponent } from "./components/machining/oee/oee-information/oee-information.component";
import { ProcessDetailInformationComponent } from "./components/machining/process-detail/process-detail-information/process-detail-information.component";

import { reducerName, reducers } from "./data-warehouse.reducers.index";

import { DowntimeEffects } from "./effects/downtime.effects";
import { OeeEffects } from "./effects/oee.effects";
import { ProcessDetailEffects } from "./effects/process-detail.effects";
import { ProcessDetailFilterBoxComponent } from "./components/machining/process-detail/process-detail-filter-box/process-detail-filter-box.component";
import { DowntimeFilterBoxComponent } from "./components/machining/downtime/downtime-filter-box/downtime-filter-box.component";
import { OeeFilterBoxComponent } from "./components/machining/oee/oee-filter-box/oee-filter-box.component";
import { MimsUIModule } from "src/app/mims-ui/mims-ui.module";
import { DowntimeStore } from "./stores/downtime.store";

const DataWarehouseRoutingModule = RouterModule.forChild([
  { path: "downtime", component: DowntimeComponent },
  { path: "oee", component: OeeComponent },
  { path: "process-detail", component: ProcessDetailComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MimsUIModule,
    DataWarehouseRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(reducerName, reducers),
    EffectsModule.forFeature([
      DowntimeEffects,
      OeeEffects,
      ProcessDetailEffects,
    ]),
  ],
  providers: [DowntimeStore],
  declarations: [
    DataWarehouseComponent,
    DowntimeInformationComponent,
    OeeInformationComponent,
    ProcessDetailInformationComponent,
    DowntimeComponent,
    OeeComponent,
    ProcessDetailComponent,
    DowntimeFilterBoxComponent,
    ProcessDetailFilterBoxComponent,
    OeeFilterBoxComponent,
  ],
})
export class DataWarehouseModule {}
