import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import {
  MachineStateDataRequestModelUI,
  MachineStateSaveDataModelUI,
} from "../../models/machine-state.model";
import { MachineStateStore } from "../../store/machine-state.store";
import { Store } from "@ngrx/store";
import {
  getMachineData,
  updateMachineData,
} from "../../actions/machine-state.actions";

@Component({
  standalone: false,
  templateUrl: "machine-state.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachineStateComponent {
  public readonly header = {
    HeaderTitle: "Pareto Chart",
    HeaderSubTitle: "Machines",
    Color: "#5965e7",
  };

  private readonly machineStateStore = inject(MachineStateStore);
  private store = inject(Store);

  public readonly machineData = this.machineStateStore.machineData;
  private request: MachineStateDataRequestModelUI = {
    machineId: 1,
  };

  ngOnInit() {
    this.store.dispatch(
      getMachineData({
        payload: this.request,
      })
    );
  }

  public saveMachine(data: MachineStateSaveDataModelUI): void {
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
