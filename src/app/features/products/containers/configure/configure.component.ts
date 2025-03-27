import { Component, ViewChild, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import * as fromModule from "../../products.reducers.index";
import {
  getProductDetails,
  saveProductDetails,
  getOperations,
  addOperation,
  removeOperation,
  getMachineOperations,
  addMachineOperation,
  removeMachineOperation,
  getMotes,
  addMote,
  removeMote,
  getSensors,
  addSensor,
  removeSensor,
  getResumePage,
  finishWizard,
  getEdgesSelectBox,
  getMessagesSelectBox,
  getSubcontractorsSelectBox,
  getMachineSelectBox,
} from "../../actions/configure.actions";

import {
  ProductModelUI,
  OperationModelUI,
  MachineOperationModelUI,
  MoteModelUI,
  SensorModelUI,
  ConfigureSelectBoxModelUI,
  ResumeConfigurationModelUI,
} from "../../models/configure.model";

import { WizardComponent } from "src/app/mims-ui/forms/wizard/wizard.component";
import { WizardPageModel } from "src/app/mims-ui/forms/wizard/models/wizard.models";

@Component({
  standalone: false,
  templateUrl: "./configure.component.html",
})
export class ConfigureComponent implements OnInit {
  public productWizardPageMetaData: WizardPageModel[] = [];

  public productDetailsData$!: Observable<ProductModelUI>;
  public operationsData$!: Observable<OperationModelUI[]>;
  public machinesData$!: Observable<MachineOperationModelUI[]>;
  public motesData$!: Observable<MoteModelUI[]>;
  public sensorsData$!: Observable<SensorModelUI[]>;
  public resumeData$!: Observable<ResumeConfigurationModelUI>;

  public machineSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;
  public moteSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;
  public operationsSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;
  public edgeSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;
  public subcontractorSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;
  public messageSelectBoxData$!: Observable<ConfigureSelectBoxModelUI[]>;

  @ViewChild("configurationWizard")
  private configurationWizard!: WizardComponent;

  private productId = 1;

  constructor(private store: Store<fromModule.ProductState>) {}

  ngOnInit(): void {
    this.setWizardsPageTitlesAndPageIds();
    this.initListSelectors();
    this.initSelectBoxSelectors();
    this.dispatchInitialLoad();
  }

  protected onWizardNextPage(pageId: string): void {
    switch (pageId) {
      case "product":
        this.store.dispatch(getOperations({ productId: this.productId }));
        this.store.dispatch(getSubcontractorsSelectBox());
        break;
      case "operations":
        this.store.dispatch(
          getMachineOperations({ productId: this.productId })
        );
        this.store.dispatch(getMachineSelectBox());
        this.store.dispatch(getOperations({ productId: this.productId }));
        break;
      case "machines":
        this.store.dispatch(getMotes({ productId: this.productId }));
        this.store.dispatch(getEdgesSelectBox());
        break;
      case "motes":
        this.store.dispatch(getSensors({ productId: this.productId }));
        this.store.dispatch(getMessagesSelectBox());
        break;
      case "sensors":
        this.store.dispatch(getResumePage({ payload: {} }));
        break;
    }

    this.navigateToNextPage();
  }

  protected onWizardFinish(): void {
    this.store.dispatch(finishWizard());
    this.configurationWizard.resetForm();
    this.configurationWizard.navigateToFirstPage();
    this.dispatchInitialLoad();
  }

  protected navigateToNextPage(): void {
    this.configurationWizard.navigateToNextPage();
  }

  protected saveProductDetail(product: ProductModelUI): void {
    product.Id = this.productId;
    this.store.dispatch(saveProductDetails({ product }));
  }

  protected addOperation(operation: OperationModelUI): void {
    operation.ProductId = this.productId;
    this.store.dispatch(addOperation({ operation }));
  }

  protected removeOperation(operation: OperationModelUI): void {
    this.store.dispatch(removeOperation({ operationId: operation.Id }));
  }

  protected addMachine(machine: MachineOperationModelUI): void {
    machine.ProductId = this.productId;
    this.store.dispatch(addMachineOperation({ machine }));
  }

  protected removeMachine(machine: MachineOperationModelUI): void {
    this.store.dispatch(removeMachineOperation({ id: machine.Id }));
  }

  protected addMote(mote: MoteModelUI): void {
    mote.ProductId = this.productId;
    this.store.dispatch(addMote({ mote }));
  }

  protected removeMote(mote: MoteModelUI): void {
    this.store.dispatch(removeMote({ moteId: mote.Id }));
  }

  protected addSensor(sensor: SensorModelUI): void {
    sensor.ProductId = this.productId;
    this.store.dispatch(addSensor({ sensor }));
  }

  protected removeSensor(sensor: SensorModelUI): void {
    this.store.dispatch(removeSensor({ sensorId: sensor.Id }));
  }

  private setWizardsPageTitlesAndPageIds(): void {
    this.productWizardPageMetaData = [
      { Id: "product", Title: "Product Details" },
      { Id: "operations", Title: "Operations" },
      { Id: "machines", Title: "Machine Details" },
      { Id: "motes", Title: "Motes Details" },
      { Id: "sensors", Title: "Sensor Details" },
      { Id: "resume", Title: "Resume" },
    ];
  }

  private dispatchInitialLoad(): void {
    this.store.dispatch(getProductDetails({ productId: this.productId }));
  }

  private initListSelectors(): void {
    this.productDetailsData$ = this.store.pipe(
      select(fromModule.getProductDetail),
      map((data) => data ?? ({} as ProductModelUI))
    );
    this.operationsData$ = this.store.pipe(
      select(fromModule.getOperationsDetails)
    );
    this.machinesData$ = this.store.pipe(
      select(fromModule.getMachineOperationsDetails)
    );
    this.motesData$ = this.store.pipe(select(fromModule.getMotesDetails));
    this.sensorsData$ = this.store.pipe(select(fromModule.getSensorsDetails));
    this.resumeData$ = this.store.pipe(select(fromModule.getResumePage));
  }

  private initSelectBoxSelectors(): void {
    this.machineSelectBoxData$ = this.store.pipe(
      select(fromModule.getMachineSelectBox)
    );
    this.moteSelectBoxData$ = this.store.pipe(
      select(fromModule.getMotesSelectBox)
    );
    this.operationsSelectBoxData$ = this.store.pipe(
      select(fromModule.getOperationsSelectBox)
    );
    this.edgeSelectBoxData$ = this.store.pipe(
      select(fromModule.getEdgeSelectBox)
    );
    this.subcontractorSelectBoxData$ = this.store.pipe(
      select(fromModule.getSubContractorsSelectBox)
    );
    this.messageSelectBoxData$ = this.store.pipe(
      select(fromModule.getMessagesSelectBox)
    );
  }
}
