import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import * as loadingActions from "../../../main/actions/loading.actions";
import * as fromMain from "../../../main/main.reducers.index";

import {
  GetProcessDetailData,
  GetProcessDetailDataSuccess,
  ProcessDetailActionTypes,
  ProcessDetailFailure,
  GetProcessDetailDataSelectBoxes,
  GetProcessDetailDataSelectBoxesSuccess,
} from "../actions/process-detail.actions";

import {
  ProcessDetailDataModelUI,
  ProcessDetailTableModelUI,
  ProcessDetailTableInformationModelUI,
  ProcessDetailChartModelUI,
} from "../models/process-detail.models";
import { IProcessDetailMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/iprocess-detail.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

@Injectable()
export class ProcessDetailEffects {
  constructor(
    private processDetailService: IProcessDetailMachiningService,
    private machineService: IMachineService,
    private actions$: Actions,
    private mainStore$: Store<fromMain.MainState>
  ) {}

  public getProcessDetailData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetProcessDetailData>(
        ProcessDetailActionTypes.GetProcessDetailData
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      map((action) => action.payload),
      switchMap((payload) =>
        of([
          {
            Id: null,
            MachineState: "Not Scheduled",
            Reason: "",
            Duration: 60,
            StartTime: "2018-11-08T00:00:00",
            EndTime: "2018-11-08T01:00:00",
          },
          {
            Id: null,
            MachineState: "In Production",
            Reason: "",
            Duration: 300,
            StartTime: "2018-11-08T01:00:00",
            EndTime: "2018-11-08T06:00:00",
          },
          {
            Id: null,
            MachineState: "Unplanned Downtime",
            Reason: "Tool Change",
            Duration: 20,
            StartTime: "2018-11-08T06:00:00",
            EndTime: "2018-11-08T06:20:00",
          },
          {
            Id: null,
            MachineState: "In Production",
            Reason: "",
            Duration: 360,
            StartTime: "2018-11-08T06:20:00",
            EndTime: "2018-11-08T12:20:00",
          },
          {
            Id: null,
            MachineState: "Unplanned Downtime",
            Reason: "No reason given",
            Duration: 100,
            StartTime: "2018-11-08T12:20:00",
            EndTime: "2018-11-08T14:00:00",
          },
          {
            Id: null,
            MachineState: "In Production",
            Reason: "",
            Duration: 20,
            StartTime: "2018-11-08T14:00:00",
            EndTime: "2018-11-08T14:20:00",
          },
          {
            Id: null,
            MachineState: "Not Scheduled",
            Reason: "",
            Duration: 360,
            StartTime: "2018-11-08T14:20:00",
            EndTime: "2018-11-08T20:00:00",
          },
        ])
          // TODO: When backend is finished, uncomment service and the load tests
          // this.processDetailService.GetProcessDetailData(payload)
          .pipe(
            map((response: any[]) => {
              const processDetailData: ProcessDetailDataModelUI = {
                Chart: convertApiDataToProcessDetailChartModelUI(response),
                Table: convertApiDataToProcessDetailTableModelUI(response),
              };

              return new GetProcessDetailDataSuccess(processDetailData);
            }),
            finalize(() =>
              this.mainStore$.dispatch(new loadingActions.HideLoading())
            ),
            catchError((error) => {
              return of(new ProcessDetailFailure(error));
            })
          )
      )
    )
  );

  public getProcessDetailDataSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetProcessDetailDataSelectBoxes>(
        ProcessDetailActionTypes.GetProcessDetailDataSelectBoxes
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.machineService.GetMachines().pipe(
          map((response: any[]) => {
            return new GetProcessDetailDataSelectBoxesSuccess(
              convertApiDataToSelectBox(response)
            );
          }),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          ),
          catchError((error) => {
            return of(new ProcessDetailFailure(error));
          })
        )
      )
    )
  );

  public getProcessDetailDataSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetProcessDetailDataSuccess>(
          ProcessDetailActionTypes.GetProcessDetailDataSuccess
        )
      ),
    { dispatch: false }
  );

  public getProcessDetailDataSelectBoxSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<GetProcessDetailDataSelectBoxesSuccess>(
          ProcessDetailActionTypes.GetProcessDetailDataSelectBoxesSuccess
        )
      ),
    { dispatch: false }
  );

  public processDetailFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ProcessDetailFailure>(
          ProcessDetailActionTypes.ProcessDetailFailure
        ),
        tap((error) => {
          console.error("Error:", error);
        })
      ),
    { dispatch: false }
  );
}

/**
 * Manipulate api data to be readable by table
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by table
 */
export function convertApiDataToProcessDetailTableModelUI(
  data: any
): ProcessDetailTableInformationModelUI {
  const tableData: ProcessDetailTableModelUI[] = data.map((elem: any) => ({
    Id: null as number | null,
    MachineState: elem.MachineState,
    Reason: elem.Reason,
    Duration: elem.Duration,
    StartTime: elem.StartTime,
    EndTime: elem.EndTime,
  }));

  return {
    Information: tableData,
    Total: tableData.length,
  };
}

export function convertApiDataToSelectBox(data: any[]): MimsSelectBoxModel[] {
  return data.map((elem) => ({
    name: elem.Name,
    value: elem.Id,
    selected: false,
  }));
}

/**
 * Manipulate api data to be readable by chart
 * @param data data from api to be manipulated
 * @returns data formated soo the data can be read by chart
 */
export function convertApiDataToProcessDetailChartModelUI(
  data: any[]
): ProcessDetailChartModelUI[] {
  return [
    {
      name: "",
      series: data.map((elem) => ({
        name: new Date(elem.EndTime).toISOString(),
        value: elem.Duration,
        extra: {
          startTime: elem.StartTime,
          endTime: elem.EndTime,
          machineState: elem.MachineState,
        },
      })),
    },
  ];
}
