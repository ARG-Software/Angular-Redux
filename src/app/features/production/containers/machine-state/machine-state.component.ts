import { Observable } from "rxjs";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import {
  MachineStateLoadDataModelUI,
  MachineStateDataRequestModelUI,
  MachineStateSaveDataModelUI,
} from "../../models/machine-state.model";
import { Store } from "@ngrx/store";
import * as fromReducer from "../../production.reducers.index";
import {
  getMachineData,
  updateMachineData,
} from "../../actions/machine-state.actions";

@Component({
  standalone: false,
  templateUrl: "machine-state.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachineStateComponent implements OnInit {
  public header = {
    HeaderTitle: "Pareto Chart",
    HeaderSubTitle: "Machines",
    Color: "#5965e7",
  };

  public machineData$: Observable<MachineStateLoadDataModelUI[]>;

  private request: MachineStateDataRequestModelUI = {
    machineId: 1,
  };

  constructor(private store: Store<fromReducer.ProductionState>) {
    this.machineData$ = this.store.select(fromReducer.getMachineData);
  }

  public ngOnInit() {
    this.store.dispatch(getMachineData({ payload: this.request }));
  }

  /**
   * Dispatch action to update machine state with new option
   */
  public saveMachine(data: MachineStateSaveDataModelUI) {
    const updatedData: MachineStateSaveDataModelUI = {
      ...data,
      Option: {
        ...data.Option,
        selected: true,
      },
    };

    this.store.dispatch(updateMachineData({ payload: updatedData }));
  }
}
