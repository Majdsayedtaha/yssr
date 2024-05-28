import { IEnum } from 'src/app/core/interfaces';

export interface ISuretyRequest {
  requestDateMilady: string;
  requestNumber: string;
  worker?: IEnum;
  workerId: string;
  customer?: IEnum;
  sponsorshipTransferType?: IEnum;
  customerId: string;
  net?: number;
  taxType?: IEnum;
  oldSponsor?: IEnum;
  newSponsor?: IEnum;
  taxTypeId: string;
  sponsorshipTransferTaxAmount: number;
  sponsorshipTransferAmount: number;
  note: string;
}


export interface ISurety {
  requestNumber: string;
  date: string;
  customerName: string;
  workerName: string;
  transferType: string;
  financialStatus: string;
}
