import { IEnum } from 'src/app/core/interfaces/enum.interface';

export interface IRefund extends IRefundProcedure {
  workerId: string;
  worker: IEnum;
  accommodationFee: number;
  accomodationFee: number;
  id: string;
  code: string;
  requestNumber: number;
  visaCost: number;
  workerSalary: number;
  recruitAmount: number;
  customerRecruitAmount: number;
  recruitmentContractId: string | IEnum | any;
  recruitmentContract: IEnum;
  customerProcedureId: number;
  testDailyCost?: number;
  customerProcedure?: IEnum;
}
export interface IRefundProcedure {
  date: string;
  testPeriodInDays: number;
  testCostDaily: number;
  testWorkerSalary: number;
  testOfficeAmount: number;
  refuseTestDays: number;
  refuseCustomerAmount: number;
  refuseWorkerAmount: number;
  refuseOfficeAmount: number;
  finalExitReasonNote: string;
  escapeWorkerReason: string;
  note: string;
  includingAccommodationAndTransferFees: boolean;
  workerReturnRequestId: string;
  procedureId: string;
  customerId: string;
  customer: IEnum;
  escapeWorkerTypeId: string;
}
export interface IRefundStatistics {
  replacementCount: number;
  returnCount: number;
  totalCount: number;
}
export interface IReturnWorkerData {
  id: string;
  requestNo: string;
  requestDate: string;
  arrivalDate: string;
  periodWithCustomer: string;
  restPeriodWithCustomer: string;
  financialStatus: string;
  recruitmentContractId: string;
  visaCost?: string;
  accommodationFee?: string;
  workerSalary?: string;
  recruitAmount?: string;
  officeAmount?: string;
  customerRecruitAmount?: string;
  customerAmount: string;
}

export enum RefundProcedureTypeEnum {
  // Return = 3,
  InExperiment = 9,
  FinalExit = 10,
  WorkerEscaped = 11,
  RefuseFromExperiment = 12,
  Accept = 13,
}

export interface ILogRefundProcedure {
  id: string;
  procedureName: string;
  procedureDate: string;
}
