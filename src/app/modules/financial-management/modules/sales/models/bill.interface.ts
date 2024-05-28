import { IEnum } from 'src/app/core/interfaces';

export interface IBillSales {
  id: string;
  date: string;
  billNumber: number;
  dueDate: string;
  paymentDestination: string;
  bank: string;
  checkNumber: string;
  checkDueDate: string;
  networkDeviceNumber: string;
  typeId: string;
  customerId: string;
  services: IService[];
  type?: IEnum;
  customer?: IEnum;
  store?: IEnum;
  network?: IEnum;
}

export interface IService {
  requestId: string;
  details: string;
  description: string;
  amount: number;
  taxTypeId: string;
  parallelServiceId: string;
}
