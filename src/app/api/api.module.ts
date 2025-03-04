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
import { MachineOperationService } from "./services/classes/core/machineoperation.service";
import { DowntimeRecordService } from "./services/classes/core/downtimerecord.service";
import { DowntimeMachiningService } from "./services/classes/core/data-warehouse/downtime.service";
import { OeeMachiningService } from "./services/classes/core/data-warehouse/oee.service";
import { ProcessDetailMachiningService } from "./services/classes/core/data-warehouse/process-detail.service";
import { ContactMessageService } from "./services/classes/core/contactmessage.service";
import { IContactMessageService } from "./services/interfaces/core/icontactmessage.service";
import { AuthorizationService } from "./services/classes/core/autorization.service";
import { EdgeService } from "./services/classes/core/edge.service";
import { ElectricalContactService } from "./services/classes/core/electricalcontact.service";
import { MachineService } from "./services/classes/core/machine.service";
import { MoteService } from "./services/classes/core/mote.service";
import { OperationService } from "./services/classes/core/operation.service";
import { ProductService } from "./services/classes/core/product.service";
import { MachineStateService } from "./services/classes/core/production/machine-state.service";
import { MessagingService } from "./services/classes/core/production/messaging.service";
import { SettingsService } from "./services/classes/core/settings.service";
import { SubcontractorService } from "./services/classes/core/subcontractor.service";
import { IDownTimeMachiningService } from "./services/interfaces/core/data-warehouse/idowntime.service";
import { IOeeMachiningService } from "./services/interfaces/core/data-warehouse/ioee.service";
import { IProcessDetailMachiningService } from "./services/interfaces/core/data-warehouse/iprocess-detail.service";
import { IAuthorizationService } from "./services/interfaces/core/iauthorization.service";
import { IDownTimeRecordService } from "./services/interfaces/core/idowntimerecord.service";
import { IEdgeService } from "./services/interfaces/core/iedge.service";
import { IElectricalConcactService } from "./services/interfaces/core/ielectricalcontact.service";
import { IMachineService } from "./services/interfaces/core/imachine.service";
import { IMachineOperationService } from "./services/interfaces/core/imachineoperation.service";
import { IMoteService } from "./services/interfaces/core/imote.service";
import { IOperationService } from "./services/interfaces/core/ioperation.service";
import { IProductService } from "./services/interfaces/core/iproduct.service";
import { ISettingsService } from "./services/interfaces/core/isettings.service";
import { ISubcontractorService } from "./services/interfaces/core/isubcontractor.service";
import { IMachineStateService } from "./services/interfaces/core/production/imachine-state.service";
import { IMessagingService } from "./services/interfaces/core/production/imessaging.service";

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
