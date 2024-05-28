import { IEnum } from 'src/app/core/interfaces';

export interface IDelegationsRequest {
  requestDate: string;
  requestDateMilady?: string;
  requestNumber: string;
  religion?: IEnum;
  religionId: string;
  age?: IEnum;
  ageId: string;
  country?: IEnum;
  countryId: string;
  jobId: string;
  job?: IEnum;
  customer: IEnum;
  worker: IEnum;
  workersCount: number;
  delegationStatus?: IEnum;
  delegationNum: string;
  delegationDateMilady: string;
  musanedDateMilady: string;
  musanedNumber: string;
  sponsorshipTransferTaxAmount: number;
  taxType?: IEnum;
  delegationOffice: string;
  sponsorshipTransferAmount: number;
  note: string;
}
export interface IDelegationsStatistics {
  totalCount: number;
  confirmedCount: number;
  unconfirmedCount: number;
  sponsorshipNotTransferredCount: number;
  sponsorshipTransferredCount: number;
}

export interface IDelegation {
  requestNumber: string;
  requestDate: string;
  customerName: string;
  workerName: string;
  jobName: string;
  delegationOffice: string;
  delegationStatus: string;
}
