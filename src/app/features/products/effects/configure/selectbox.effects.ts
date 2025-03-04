import { Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import * as fromModule from "../../products.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import {
  GetEdgesSelectBox,
  GetMessagesSelectBox,
  GetSubcontractorsSelectBox,
  GetMachineSelectBox,
  GetEdgesSelectBoxSuccess,
  GetMessagesSelectBoxSuccess,
  GetSubcontractorsSelectBoxSuccess,
  GetMachineSelectBoxSuccess,
  ErrorConfiguration,
  ConfigurationActionTypes,
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
  constructor(
    private actions$: Actions,
    private moduleStore$: Store<fromModule.ProductState>,
    private mainStore$: Store<fromMain.MainState>,
    private machineService: IMachineService,
    private subcontractorService: ISubcontractorService,
    private edgeService: IEdgeService,
    private messagesService: IContactMessageService
  ) {}

  public getEdgesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetEdgesSelectBox>(ConfigurationActionTypes.GetEdgesSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getEdgeSelectBox))
      ),
      filter(([_, edgesSelectBox]) => edgesSelectBox.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.edgeService.GetEdges().pipe(
          map((edgeList: IEdgeDto[]) => {
            const edgeListCasted =
              mapObjectTypeToRequested<EdgeModelUI[]>(edgeList);
            const edgeSelectBox = edgeListCasted.map(
              (element): ConfigureSelectBoxModelUI => ({
                name: element.Model,
                selected: false,
                value: element.Id,
              })
            );
            return new GetEdgesSelectBoxSuccess(edgeSelectBox);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public getMessagesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMessagesSelectBox>(
        ConfigurationActionTypes.GetMessagesSelectBox
      ),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMessagesSelectBox))
      ),
      filter(([_, messagesSelectBox]) => messagesSelectBox.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.messagesService.GetContactMessages().pipe(
          map((messageList: IContactMessageDto[]) => {
            const messageListCasted =
              mapObjectTypeToRequested<MessageModelUI[]>(messageList);
            const messageSelectBox = messageListCasted.map(
              (element): ConfigureSelectBoxModelUI => ({
                name: element.Name,
                selected: false,
                value: element.Id,
              })
            );
            return new GetMessagesSelectBoxSuccess(messageSelectBox);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public getSubContractorsSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetSubcontractorsSelectBox>(
        ConfigurationActionTypes.GetSubcontractorsSelectBox
      ),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getSubContractorsSelectBox))
      ),
      filter(
        ([_, subcontractorsSelectBox]) => subcontractorsSelectBox.length === 0
      ),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.subcontractorService.GetSubcontractors().pipe(
          map((subcontractorsList: ISubcontractorsDto[]) => {
            const subcontractorsListCasted =
              mapObjectTypeToRequested<SubcontractorModelUI[]>(
                subcontractorsList
              );
            const subcontractorsSelectBox = subcontractorsListCasted.map(
              (element): ConfigureSelectBoxModelUI => ({
                name: element.Name,
                selected: false,
                value: element.Id,
              })
            );
            return new GetSubcontractorsSelectBoxSuccess(
              subcontractorsSelectBox
            );
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public getMachinesSelectBox$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetMachineSelectBox>(ConfigurationActionTypes.GetMachineSelectBox),
      withLatestFrom(
        this.moduleStore$.pipe(select(fromModule.getMachineSelectBox))
      ),
      filter(([_, machinesSelectBox]) => machinesSelectBox.length === 0),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(() =>
        this.machineService.GetMachines().pipe(
          map((machineList: IMachineDto[]) => {
            const machineListCasted =
              mapObjectTypeToRequested<MachineModelUI[]>(machineList);
            const machineSelectBox = machineListCasted.map(
              (element): ConfigureSelectBoxModelUI => ({
                name: element.Name,
                selected: false,
                value: element.Id,
              })
            );
            return new GetMachineSelectBoxSuccess(machineSelectBox);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );
}
