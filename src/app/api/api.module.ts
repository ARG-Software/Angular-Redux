import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { TokenInterceptor } from "./interceptors/token.interceptor";
import { ApiAuthService } from "./services/api-auth.service";
import { AuthorizationService } from "@api/services/classes/core/autorization.service";
import { MachineOperationService } from "./services/classes/core/machineoperation.service";
import { DowntimeRecordService } from "./services/classes/core/downtimerecord.service";
import { DowntimeMachiningService } from "./services/classes/core/data-warehouse/downtime.service";
import { OeeMachiningService } from "./services/classes/core/data-warehouse/oee.service";
import { ProcessDetailMachiningService } from "./services/classes/core/data-warehouse/process-detail.service";
import { SettingsService } from "@api/services/classes/core/settings.service";
import { ProductService } from "@api/services/classes/core/product.service";
import { MachineService } from "@api/services/classes/core/machine.service";
import { MachineStateService } from "@api/services/classes/core/production/machine-state.service";
import { MessagingService } from "@api/services/classes/core/production/messaging.service";
import { OperationService } from "@api/services/classes/core/operation.service";
import { SubcontractorService } from "@api/services/classes/core/subcontractor.service";
import { EdgeService } from "@api/services/classes/core/edge.service";
import { ElectricalContactService } from "@api/services/classes/core/electricalcontact.service";
import { MoteService } from "@api/services/classes/core/mote.service";
import { ContactMessageService } from "./services/classes/core/contactmessage.service";

// Interfaces
import { IAuthorizationService } from "@api/services/interfaces/core/iauthorization.service";
import { IMachineOperationService } from "@api/services/interfaces/core/imachineoperation.service";
import { IDownTimeRecordService } from "@api/services/interfaces/core/idowntimerecord.service";
import { IDownTimeMachiningService } from "@api/services/interfaces/core/data-warehouse/idowntime.service";
import { IOeeMachiningService } from "@api/services/interfaces/core/data-warehouse/ioee.service";
import { IProcessDetailMachiningService } from "@api/services/interfaces/core/data-warehouse/iprocess-detail.service";
import { ISettingsService } from "@api/services/interfaces/core/isettings.service";
import { IProductService } from "@api/services/interfaces/core/iproduct.service";
import { IMachineService } from "@api/services/interfaces/core/imachine.service";
import { IMachineStateService } from "@api/services/interfaces/core/production/imachine-state.service";
import { IMessagingService } from "@api/services/interfaces/core/production/imessaging.service";
import { IOperationService } from "@api/services/interfaces/core/ioperation.service";
import { ISubcontractorService } from "@api/services/interfaces/core/isubcontractor.service";
import { IEdgeService } from "@api/services/interfaces/core/iedge.service";
import { IElectricalConcactService } from "@api/services/interfaces/core/ielectricalcontact.service";
import { IMoteService } from "@api/services/interfaces/core/imote.service";
import { IContactMessageService } from "./services/interfaces/core/icontactmessage.service";

@NgModule({
  imports: [CommonModule],
})
export class ApiModule {
  public static forRoot(): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        ApiAuthService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: IAuthorizationService, useClass: AuthorizationService },
        {
          provide: IMachineOperationService,
          useClass: MachineOperationService,
        },
        { provide: IDownTimeRecordService, useClass: DowntimeRecordService },
        {
          provide: IDownTimeMachiningService,
          useClass: DowntimeMachiningService,
        },
        { provide: IOeeMachiningService, useClass: OeeMachiningService },
        {
          provide: IProcessDetailMachiningService,
          useClass: ProcessDetailMachiningService,
        },
        { provide: ISettingsService, useClass: SettingsService },
        { provide: IMachineService, useClass: MachineService },
        { provide: IProductService, useClass: ProductService },
        { provide: IMachineStateService, useClass: MachineStateService },
        { provide: IMessagingService, useClass: MessagingService },
        { provide: IOperationService, useClass: OperationService },
        { provide: ISubcontractorService, useClass: SubcontractorService },
        { provide: IEdgeService, useClass: EdgeService },
        {
          provide: IElectricalConcactService,
          useClass: ElectricalContactService,
        },
        { provide: IMoteService, useClass: MoteService },
        { provide: IContactMessageService, useClass: ContactMessageService },
      ],
    };
  }
}
