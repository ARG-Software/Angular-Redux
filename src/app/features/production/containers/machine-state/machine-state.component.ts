import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MachineStateSaveDataModelUI } from "../../models/machine-state.model";
import { MachineStateStore } from "../../stores/machine-state.store";

@Component({
  selector: "app-machine-state",
  templateUrl: "machine-state.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MachineStateComponent {
  public readonly header = {
    HeaderTitle: "Pareto Chart",
    HeaderSubTitle: "Machines",
    Color: "#5965e7",
  };

  private readonly store = inject(MachineStateStore);
  public machineData = this.store.machineData;
  public loading = this.store.loading;

  async ngOnInit(): Promise<void> {
    try {
      await this.store.loadMachineData(1);
    } catch (err) {
      console.error("Error loading machine data", err);
    }
  }

  async saveMachine(data: MachineStateSaveDataModelUI): Promise<void> {
    try {
      await this.store.updateMachineData({
        ...data,
        Option: {
          ...data.Option,
          selected: true,
        },
      });
    } catch (err) {
      console.error("Error updating machine data", err);
    }
  }
}
