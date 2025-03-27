import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import {
  addSensor,
  addSensorSuccess,
  getSensors,
  getSensorsSuccess,
  removeSensor,
  removeSensorSuccess,
  sensorConfigurationError,
} from "../../actions/configure.actions";
import {
  tap,
  withLatestFrom,
  filter,
  switchMap,
  map,
  catchError,
  finalize,
} from "rxjs/operators";
import { SensorModelUI } from "../../models/configure.model";
import { of } from "rxjs";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { IElectricalConcactService } from "src/app/api/services/interfaces/core/ielectricalcontact.service";
import { IElectricalContactDto } from "src/app/api/models/apimodels";

@Injectable()
export class ConfigureSensorsEffects {
  private actions$ = inject(Actions);
  private moduleStore$ = inject<Store<fromModule.ProductState>>(Store);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private sensorService = inject<IElectricalConcactService>(
    IElectricalConcactService
  );

  getSensors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSensors),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getSensorUpdateState))
      ),
      filter(([_, needsUpdate]) => needsUpdate),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(([{ productId }]) =>
        this.sensorService.GetECofProduct(productId).pipe(
          map((list) => {
            const sensors = mapObjectTypeToRequested<SensorModelUI[]>(list);
            return getSensorsSuccess({ sensors });
          }),
          catchError((error) => of(sensorConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  addSensor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSensor),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ sensor }) =>
        this.sensorService.AddEC(sensor as any).pipe(
          map((response) => {
            const sensorCasted =
              mapObjectTypeToRequested<SensorModelUI>(response);
            return addSensorSuccess({ sensor: sensorCasted });
          }),
          catchError((error) => of(sensorConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );

  removeSensor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeSensor),
      tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
      switchMap(({ sensorId }) =>
        this.sensorService.DeleteEC(sensorId).pipe(
          map((deleted) =>
            deleted
              ? removeSensorSuccess({ sensorId })
              : sensorConfigurationError({ error: "Delete failed" })
          ),
          catchError((error) => of(sensorConfigurationError({ error }))),
          finalize(() => this.mainStore$.dispatch(loadingActions.hideLoading()))
        )
      )
    )
  );
}
