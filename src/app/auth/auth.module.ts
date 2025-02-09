import { AuthGuard } from './guards/auth.guard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './containers/login.component';
import { RouterModule } from '@angular/router';
import { AuthEffects } from './effects/auth.effect';
import { StoreModule } from '@ngrx/store';
import { reducers, reducerName } from './auth.reducers.index';
import { LogoutComponent } from './containers/logout.component';

const AuthRoutingModule = RouterModule.forChild([
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'main', canActivate: [AuthGuard],  loadChildren: '../main/main.module#MainModule' }
]);

@NgModule({
  imports: [
      CommonModule,
      AuthRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      StoreModule.forFeature(reducerName, reducers),
      EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [
      AuthComponent,
      LoginComponent,
      LogoutComponent
  ],
  providers: [AuthGuard]
})
export class AuthModule {}
