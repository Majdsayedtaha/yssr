import { IEnum } from 'src/app/core/interfaces';
import { ICustomer } from '../../customers/models';
import { IWorker } from '../../worker/models';

export interface IRent extends IRentRow {
  code: string;
  id?: string;
  requestDateMilady: string;
  realEndDate: string;
  requestNumber: string;
  fromDateMilady: string;
  toDateMilady: string;
  receivingSuggestedTime: string;
  rentDaysPeriod?: number;
  rentHoursPeriod?: number;
  rentAmountWithoutTax: number;
  taxAmount: number;
  rentAmountWithTax: number;
  rentAmount: number;
  receivingLocation?: string;
  receivingAddress?: string;
  receivingFees?: number;
  customerId?: any;
  customer?: ICustomer;
  workerId?: any;
  worker?: IWorker;
  rentTypeId: string;
  rentType?: IEnum;
  receivingTypeId: string;
  receivingType?: IEnum;
  taxTypeId: string;
  taxType?: IEnum;
  saveWithSendEmail: boolean;
  saveWithSendSms: boolean;
  financialStatus: any; //TODO Backend once string and once enum
  requestStatus: any; //TODO Backend once string and once enum
  rentRequest: any;
  rentRequestId: any;
}

export interface IRentProcedure {
  code: string;
  id: string;
  date: string;
  rentPeriod: number;
  retrieveDate: string;
  realCustomerContractPeriod: number;
  fine: number;
  workerSalary: number;
  officeAmount: number;
  returnCustomerAmount: number;
  restPeriod: number;
  totalPeriod: number;
  returnRefuseReason: string;
  rentRequestId: string;
  procedureId: string;
}

export interface IRentStatistics extends IWorkerRentStatistics {
  totalCount: number;
  endedCount: number;
  aboutToEndCount: number;
  inProgressCount: number;
}

export interface IRentRow extends IWorkerRent {
  customerName: string;
  financialStatus: string;
  id?: string;
  job: string;
  lastProcedureDate: string;
  lastProcedureName?: any;
  nationality: string;
  rentDaysPeriod?: number;
  rentHoursPeriod?: number;
  requestDate: string;
  requestNumber?: string;
  requestStatus: string;
  workerName: string;
}

export interface IRentLogProcedure {
  procedureName: string;
  procedureDate: string;
  rentRequestId: string;
  procedureId: string;
  date: string;
  rentPeriod: string;
  realCustomerContractPeriod: string;
  fine: string;
  workerSalary: string;
  retrieveDate: string;
  officeAmount: string;
  returnCustomerAmount: string;
  restPeriod: string;
  totalPeriod: string;
  returnRefuseReason: string;
}

export enum RentTypeEnum {
  DAY = 1,
  MONTH = 2,
  HOUR = 3,
  YEAR = 4,
}
export interface IWorkerRent {
  code: string;
  name: string;
  passportNo: string;
  residenceNo: string;
  isAvailable: string | boolean;
  externalOfficeName: string;
  nationality: string;
  jobName: string;
  monthlySalary: number;
}
export interface IWorkerRentStatistics {
  availableCount: number;
  rentAboutToEndCount: number;
  unAvailableCount: number;
}
