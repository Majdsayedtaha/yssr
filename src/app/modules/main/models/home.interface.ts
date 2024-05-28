export interface IRecruitmentTotalCount {
  total: number;
}
export interface IEndRecruitmentContracts {
  customer: string;
  worker: string;
  contractDate: string;
  lastProcedure: string;
  endDate: string;
}
export interface IAboutToEndWarrantyContracts {
  customerName: string;
  customerId: string;
  workerId: string;
  workerName: string;
  contractDate: string;
  lastProcedure: string;
  remainderWarrantyPeriod: string;
}
export interface ILastProceduresCount {
  name: string;
  count: number;
}
export interface ICountriesContractsCount {
  name: string;
  count: number;
}
export interface IContractsCountPerYear {
  name: string;
  count: number;
}
export interface IAllRecruitment {
  totalCount: any;
  aboutToEndContracts: any;
  lastProcedureCount: any;
  aboutToEndWarrantyContracts: any;
  countriesContractsCount: any;
  contractsPerCurrentYear: any;
}
export interface IRecruitmentStatistics {
  // total: number;
  // hasRecruitmentWorkers: number;
  // hasRentWorkers: number;
  // individualCount: number;
  // businessCount: number;
}
export interface IAllWorker {
  total: any;
  linkedCount: any;
  unLinkedCount: any;
  cvCount: any;
  jobCount: any;
  countryCount: any;
}
export interface TotalWorker{
  name:string;
  count:number;
}
export interface ICustomerStatistics {
  total: number;
  hasRecruitmentWorkers: number;
  hasRentWorkers: number;
  individualCount: number;
  businessCount: number;
}
export interface IRefundStatistics {
  replacementCount: number;
  refundCount: number;
  byProcedureCount:IStatistics[]
}
export interface IWaiverStatistics {
  lastProcedureCount: any[];
  waiverTotalCount: number;
  externalWaiverTotalCount: number;
}

export interface IRent {
  rentRequests: any;
  totalCount: any;
  byTypeCount: any;
}

export interface IStatistics {
  count: number;
  name: string;
}
