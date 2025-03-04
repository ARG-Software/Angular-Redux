import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { reducerName, mainReducers } from "./main.reducers.index";
import { RouterModule } from "@angular/router";
import { MainComponent } from "./main.component";
import { MimsUIModule } from "../mims-ui/mims-ui.module";

const MainRoutingModule = RouterModule.forChild([
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "products",
        loadChildren: () =>
          import("../features/products/products.module").then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: "data-warehouse",
        loadChildren: () =>
          import("../features/data-warehouse/data-warehouse.module").then(
            (m) => m.DataWarehouseModule
          ),
      },
      {
        path: "production",
        loadChildren: () =>
          import("../features/production/production.module").then(
            (m) => m.ProductionModule
          ),
      },
    ],
  },
]);

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MimsUIModule,
    StoreModule.forFeature(reducerName, mainReducers),
  ],
  declarations: [MainComponent],
})
export class MainModule {}
