import { IEnum } from 'src/app/core/interfaces';

export interface IBillReturnSales extends IBillsReturnTableSales {
  id: string;
  date: string;
  billNumber: number;
  dueDate: string;
  paymentDestination: string | IEnum;
  bank: string | IEnum;
  checkNumber: string;
  checkDueDate: string;
  networkDeviceNumber: string;
  typeId: string;
  customerId: string;
  services: IService[];
}

export interface IBillsReturnTableSales {
  billNumber: number;
  checkDueDate: string;
  customer: IEnum;
  date: string;
  id: string;
  mainBill: IEnum;
  network: IEnum;
  returnRequest: IEnum;
  returnedBillType: IEnum;
  services: IService[];
  store: IEnum;
  taxAmount: number;
  type: IEnum;
}
export interface IService {
  id: string;
  requestId: string;
  details: string;
  description: string;
  amount: number;
  taxTypeId: string;
  parallelServiceId: string;
  accountNumber: string;
  request?: IEnum;
  taxType?: IEnum;
  parallelService?: IEnum;
}
