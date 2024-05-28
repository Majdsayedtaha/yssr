import { IEnum } from 'src/app/core/interfaces';

export interface IBillReceipt {}
export interface IService {}
export interface IBillReceiptTable {
  type?: IEnum;
  typeId: IEnum;
  store?: IEnum;
  storeId: IEnum;
  bank?: IEnum;
  bankId: IEnum;
  network?: IEnum;
  networkId: IEnum;
  device?: IEnum;
  deviceId: IEnum;
  bill?: IEnum;
  billId: IEnum;
  paymentDestination?: IEnum;
  paymentDestinationId: IEnum;
  sideType?: IEnum;
  sideTypeId: IEnum;
  services?: IService[];
  servicesId: IEnum;
  customer?: IEnum;
  customerId: IEnum;
  employee?: IEnum;
  employeeId: IEnum;
  office?: IEnum;
  officeId: IEnum;
  date: string;
  receiptNumber: number;
  amount: number;
  amountWritten: number;
  amountWrittenEn: number;
  description: string;
  transferDate: string;
  operationDate: string;
  operationNumber: number;
  checkNumber: number;
  benefitDate: string;
  accountName: string;
}
