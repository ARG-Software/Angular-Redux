import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

import * as loadingActions from "../../../main/actions/loading.actions";
import {
  getProcessDetailData,
  getProcessDetailDataSelectBoxes,
  processDetailFailure,
} from "../actions/process-detail.actions";
import { ProcessDetailStore } from "../stores/process-detail.store";
import { IProcessDetailMachiningService } from "src/app/api/services/interfaces/core/data-warehouse/iprocess-detail.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";
import {
  ProcessDetailChartModelUI,
  ProcessDetailTableInformationModelUI,
  ProcessDetailTableModelUI,
} from "../models/process-detail.models";

@Injectable()
export class ProcessDetailEffects {
  private readonly actions$ = inject(Actions);
  private readonly mainStore$ = inject<Store>(Store);
  private readonly processDetailStore = inject(ProcessDetailStore);

  constructor(
    private processDetailService: IProcessDetailMachiningService,
    private machineService: IMachineService
  ) {}

  getProcessDetailData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getProcessDetailData),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        map(({ payload }) => ({
          request: payload,
          originalPaging: payload.Paging,
        })),
        switchMap(({ request, originalPaging }) =>
          //TODO this.processDetailService.GetProcessDetailData(request).pipe(
          of(mockProcessDetailResponse).pipe(
            tap((response) => {
              const table = convertApiDataToProcessDetailTableModelUI(response);

              this.processDetailStore.setProcessDetailData(
                convertApiDataToProcessDetailChartModelUI(response),
                table.Information,
                { ...originalPaging, Total: table.Total }
              );
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(
                processDetailFailure({ payload: error })
              );
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  getProcessDetailSelectBoxes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getProcessDetailDataSelectBoxes),
        tap(() => this.mainStore$.dispatch(loadingActions.showLoading())),
        switchMap(() =>
          this.machineService.GetMachines().pipe(
            tap((machines) => {
              const machineSelectBox = convertApiDataToSelectBox(machines);
              this.processDetailStore.setSelectBoxes(machineSelectBox);
            }),
            finalize(() =>
              this.mainStore$.dispatch(loadingActions.hideLoading())
            ),
            catchError((error) => {
              this.mainStore$.dispatch(
                processDetailFailure({ payload: error })
              );
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );

  processDetailFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(processDetailFailure),
        tap(({ payload }) => console.error("Process Detail Error:", payload))
      ),
    { dispatch: false }
  );
}

// mock fallback
const mockProcessDetailResponse = [
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
];

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
