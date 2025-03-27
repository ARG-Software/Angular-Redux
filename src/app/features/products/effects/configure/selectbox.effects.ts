import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import {
  getEdgesSelectBox,
  getMessagesSelectBox,
  getMachineSelectBox,
  getSubcontractorsSelectBox,
  getEdgesSelectBoxSuccess,
  getMessagesSelectBoxSuccess,
  getMachineSelectBoxSuccess,
  getSubcontractorsSelectBoxSuccess,
  selectBoxConfigurationError,
} from "../../actions/configure.actions";

import {
  tap,
  withLatestFrom,
  filter,
  switchMap,
  map,
  finalize,
  catchError,
} from "rxjs/operators";
import {
  MachineModelUI,
  ConfigureSelectBoxModelUI,
  SubcontractorModelUI,
  EdgeModelUI,
  MessageModelUI,
} from "../../models/configure.model";
import { of } from "rxjs";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import {
  IEdgeDto,
  IContactMessageDto,
  ISubcontractorsDto,
  IMachineDto,
} from "src/app/api/models/apimodels";
import { IContactMessageService } from "src/app/api/services/interfaces/core/icontactmessage.service";
import { IEdgeService } from "src/app/api/services/interfaces/core/iedge.service";
import { IMachineService } from "src/app/api/services/interfaces/core/imachine.service";
import { ISubcontractorService } from "src/app/api/services/interfaces/core/isubcontractor.service";

@Injectable()
export class ConfigureSelectBoxEffects {
  private actions$ = inject(Actions);
  private moduleStore$ = inject<Store<fromModule.ProductState>>(Store);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);

  constructor(
    private machineService: IMachineService,
    private subcontractorService: ISubcontractorService,
    private edgeService: IEdgeService,
    private messagesService: IContactMessageService
  ) {}

  getEdgesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getEdgesSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getEdgeSelectBox))
      ),
      filter(([_, edges]) => edges.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.edgeService.GetEdges().pipe(
          map((edges) => {
            const selectBox = mapObjectTypeToRequested<EdgeModelUI[]>(
              edges
            ).map((e) => ({
              name: e.Model,
              value: e.Id,
              selected: false,
            }));
            return getEdgesSelectBoxSuccess({ selectBox });
          }),
          catchError((error) => of(selectBoxConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  getMessagesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMessagesSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMessagesSelectBox))
      ),
      filter(([_, messages]) => messages.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.messagesService.GetContactMessages().pipe(
          map((messages) => {
            const selectBox = mapObjectTypeToRequested<MessageModelUI[]>(
              messages
            ).map((m) => ({
              name: m.Name,
              value: m.Id,
              selected: false,
            }));
            return getMessagesSelectBoxSuccess({ selectBox });
          }),
          catchError((error) => of(selectBoxConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  getSubcontractorsSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSubcontractorsSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getSubContractorsSelectBox))
      ),
      filter(([_, subcontractors]) => subcontractors.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.subcontractorService.GetSubcontractors().pipe(
          map((list) => {
            const selectBox = mapObjectTypeToRequested<SubcontractorModelUI[]>(
              list
            ).map((s) => ({
              name: s.Name,
              value: s.Id,
              selected: false,
            }));
            return getSubcontractorsSelectBoxSuccess({ selectBox });
          }),
          catchError((error) => of(selectBoxConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  getMachinesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMachineSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMachineSelectBox))
      ),
      filter(([_, machines]) => machines.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.machineService.GetMachines().pipe(
          map((list) => {
            const selectBox = mapObjectTypeToRequested<MachineModelUI[]>(
              list
            ).map((m) => ({
              name: m.Name,
              value: m.Id,
              selected: false,
            }));
            return getMachineSelectBoxSuccess({ selectBox });
          }),
          catchError((error) => of(selectBoxConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );
}
