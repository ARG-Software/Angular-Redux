export interface IMimsPagedResult<T> {
  Success: boolean;
  Message?: string;
  Result: T[];
  Total: number;
  GeneratedAt: Date;
}

export interface IMimsResult<T> {
  Result: T;
  GeneratedAt: Date;
  Success: boolean;
  Message?: string;
}

export interface IPagedSet<T> {
  Result: T[];
  Total: number;
}

export interface IPaging {
  CurrentIndex: number;
  HowManyPerPage: number;
  PropertyToOrderBy?: string;
  Ordered?: boolean;
  IsDescending?: boolean;
  Teste?: string;
}

export interface IAccessLevelDto {
  Id: number;
  Name: number;
}

export interface IBufferDto {
  Id: number;
  PreviousOperationId?: number;
  NextOperationId?: number;
  ProductId?: number;
  Name?: string;
  Count: number;
  LowAlertLowerBound: number;
  LowAlertLowWarning: number;
  LowWarningTarget: number;
  TargetHighWarning: number;
  HighWarningHighAlert: number;
  HighAlertUpperBound: number;
}

export interface ICustomersDto {
  Id: number;
  Name?: string;
  Address?: string;
  Address2?: string;
  City?: string;
  State?: string;
  PostCode?: string;
}

export interface IDepartmentDto {
  Id: number;
  Name?: string;
}

export interface IDowntimeRecordsDto {
  Id: number;
  Machine: IMachineDto | undefined;
  Operation: IOperationDto | undefined;
  Shift: IShiftsDto | undefined;
  Operator: IOperatorsDto | undefined;
  StartTime?: Date;
  EndTime?: Date;
  DowntimeFraction: number;
}

export interface IEdgeOfflineRecordsDto {
  EdgeId: number;
  StartTime: Date;
  EndTime: Date;
}

export interface ILoginDto {
  UserName?: string;
  Password?: string;
}

export interface IMachineDto {
  Id: number;
  Name?: string;
  Manufacturer?: string;
  Model?: string;
  Serial?: string;
  MachineType: IMachineTypeDto | undefined;
}

export interface IMachineOperationsDto {
  Id: number;
  MachineId: number;
  MachineName: string;
  OperationId?: number;
  OperationName: string;
  AssetNumber: number;
  OEE: number;
  MDE: number;
}

export interface IMachineTypeDto {
  Id: number;
  Type?: string;
}

export interface IMoteDto {
  Manufacturer?: string;
  Model?: string;
  Serial?: string;
  MACAdress?: string;
  IpAddress?: string;
  TransitId: number;
  MachineId: number;
  IsOnline: boolean;
}

export interface IMoteOfflineRecordsDto {
  MoteId: number;
  StartTime: Date;
  EndTime?: Date;
}

export interface IOperationDto {
  Id: number;
  Number: number;
  OrderIndex: number;
  BatchSize?: number;
  Subcontractor: ISubcontractorsDto | undefined;
  Product: IProductsDto | undefined;
}

export interface IOperatorsDto {
  Id: number;
  Name?: string;
  Shifts: IShiftsDto | undefined;
}

export interface IPhysicalInputsDto {
  Id: number;
  MachineMCode?: string;
  MachineOutput?: string;
  NumberOnMote: number;
  MoteId: number;
  MachineId: number;
  OperationId?: number;
  MessageId: number;
}

export interface IPhysicalInputEventsDto {
  PhysicalInputId: number;
  Date: Date;
  Value?: number;
}

export interface IProductionRecordsDto {
  Id: number;
  Date: Date;
  MachineId: number;
  Operation: IOperationDto | undefined;
  Shift: IShiftsDto | undefined;
  Operator: IOperatorsDto | undefined;
}

export interface IProductsDto {
  Id: number;
  Name?: string;
  TargetHoursPerWeek: number;
  TargetEfficiency: number;
  OEE: number;
  Increase: boolean;
  SDEs: number;
}

export interface IScheduleRecordDto {
  MachineId: number;
  OperationId?: number;
  ShiftId?: number;
  OperatorId?: number;
  StartDate: Date;
  EndDate: Date;
}

export interface IShiftGraphicDto {
  Uptime: number;
  Downtime: number;
  Name?: string;
}

export interface IShiftsDto {
  Id: number;
  ShiftNumber: number;
  Name?: string;
  StartDate: Date;
  EndDate: Date;
  Department: IDepartmentDto | undefined;
}

export interface ISubcontractorsDto {
  Id: number;
  Name?: string;
  Location?: string;
  Address?: string;
  Address2?: string;
  City?: string;
  PostCode?: string;
  State?: string;
}

export interface IUsersDto {
  Id: number;
  Name: string;
  Position?: string;
  Email: string;
  Login: string;
  Password?: string;
  AccessLevel?: IAccessLevelDto | undefined;
  AccountStatus?: number;
  ProfileName?: string;
}

export interface ILoginSession {
  RefreshToken: string;
  AccessToken: string;
  User: IUsersDto;
}

export interface IDowntimeMachineParetoDto {
  AssetNumber: string;
  DowntimeInMinutes: number;
  InstancesOfDowntime: number;
}

export interface IMachineDowntimeScreenDto {
  ChartData: IDowntimeMachineParetoDto[];
  TableData: IPagedSet<IDowntimeMachineParetoDto>;
}

export interface IOEEChartSeries {
  Name: string;
  Value: number;
}

export interface IOEEChartDto {
  Name: string;
  Series: IOEEChartSeries[];
}

export interface IOEETableDto {
  Name: string;
  Availability: number;
  Production: number;
  Quality: number;
}

export interface IOEEScreenDto {
  ChartData: IOEEChartDto[];
  TableData: IPagedSet<IOEETableDto>;
}

export interface DWMachiningFilterDto {
  MachineId: number;
  ProductId: number;
  StartDate: Date;
  EndDate: Date;
}

export interface DWMachiningDowntimeScreenRequestDto {
  DWMachiningFilterDto: DWMachiningFilterDto;
  Paging: IPaging;
}

export interface IElectricalContactDto {
  Id: number;
  MachineMCode: string;
  MachineOutput: string;
  NumberOnMote: number;
  MoteId: number;
  MachineId: number;
  OperationId: number;
  MessageId: number;
}

export interface IEdgeDto {
  Id: number;
  Model: string;
}

export interface IContactMessageDto {
  Id: number;
  Name: string;
}
