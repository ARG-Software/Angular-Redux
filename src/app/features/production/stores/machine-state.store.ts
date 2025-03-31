import { Injectable, computed, inject, signal } from "@angular/core";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";
import { firstValueFrom } from "rxjs";
import { IMachineStateService } from "src/app/api/services/interfaces/core/production/imachine-state.service";

@Injectable({ providedIn: "root" })
export class MachineStateStore {
  private readonly _machineData = signal<MachineStateLoadDataModelUI[]>([]);
  private readonly _loading = signal(false);

  public readonly machineData = computed(() => this._machineData());
  public readonly loading = computed(() => this._loading());

  private readonly service = inject(IMachineStateService);

  async loadMachineData(machineId: number): Promise<void> {
    try {
      this._loading.set(true);
      const data = await firstValueFrom(
        this.service.fetchMachineData(machineId)
      );
      this._machineData.set(data);
    } catch (err) {
      console.error("Failed to load machine data", err);
    } finally {
      this._loading.set(false);
    }
  }

  async updateMachineData(update: MachineStateSaveDataModelUI): Promise<void> {
    try {
      this._loading.set(true);
      await this.service.updateMachine(update);
      const updated = this._machineData().map((m) =>
        m.Id === update.Id ? { ...m, Option: update.Option } : m
      );
      this._machineData.set(updated);
    } catch (err) {
      console.error("Failed to update machine", err);
    } finally {
      this._loading.set(false);
    }
  }
}
