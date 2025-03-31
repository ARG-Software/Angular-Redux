import { Injectable, computed, inject, signal } from "@angular/core";
import {
  MachineStateLoadDataModelUI,
  MachineStateSaveDataModelUI,
} from "../models/machine-state.model";
import { firstValueFrom } from "rxjs";
import { IMachineStateService } from "src/app/api/services/interfaces/core/production/imachine-state.service";

@Injectable()
export class MachineStateStore {
  private readonly machineDataSignal = signal<MachineStateLoadDataModelUI[]>(
    []
  );
  private readonly loadingSignal = signal(false);

  public readonly machineData = computed(() => this.machineDataSignal());
  public readonly loading = computed(() => this.loadingSignal());

  private readonly service = inject(IMachineStateService);

  async loadMachineData(machineId: number): Promise<void> {
    try {
      this.loadingSignal.set(true);
      const data = await firstValueFrom(
        this.service.fetchMachineData(machineId)
      );
      this.machineDataSignal.set(data);
    } catch (err) {
      console.error("Failed to load machine data", err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateMachineData(update: MachineStateSaveDataModelUI): Promise<void> {
    try {
      this.loadingSignal.set(true);

      await firstValueFrom(this.service.updateMachine(update));

      const updated = this.machineDataSignal().map((m) =>
        m.Id === update.Id ? { ...m, Option: update.Option } : m
      );

      this.machineDataSignal.set(updated);
    } catch (err) {
      console.error("Failed to update machine", err);
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
