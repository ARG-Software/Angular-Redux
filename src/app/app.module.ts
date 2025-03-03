import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// COMPONENTS
import { AppComponent } from "./app.component";

// REDUX
import { StoreModule, ActionReducer, MetaReducer } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { localStorageSync } from "ngrx-store-localstorage";

// ROUTING
import { RouterModule, Routes } from "@angular/router";

// CONFIGURATIONS
import { GlobalEnvironmentService } from "./global.environment.service";
import { APP_CONFIG, AppConfig } from "./app.config";
// CUSTOM MODULES
import { ApiModule } from "./api/api.module";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  const localStorage = localStorageSync({ rehydrate: true, keys: ["auth"] })(
    reducer
  );
  return localStorage;
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

const RouterRoot = RouterModule.forRoot(routes);

@NgModule({
  imports: [
    RouterRoot,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 15 }),
    ApiModule.forRoot(),
    AppComponent,
  ],
  providers: [
    provideHttpClient(),
    GlobalEnvironmentService,
    { provide: APP_CONFIG, useValue: AppConfig },
  ],
})
export class AppModule {}
