import { IEnum } from 'src/app/core/interfaces';

export interface PurchaseContract {
  id: string;
  amount: number;
  refundAmount: number;
  customer: string;
  date: string;
  requestNumber: number;
  worker: IEnum;
}
