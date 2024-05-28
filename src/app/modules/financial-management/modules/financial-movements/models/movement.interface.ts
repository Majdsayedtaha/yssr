import { IEnum } from 'src/app/core/interfaces';

export interface IMovementTransaction {
  date: string;
  typeId: string;
  amount: string;
  fromBankId: string;
  toBankId: string;
  fromStoreId: string;
  toStoreId: string;
  fromBank: IEnum;
  fromStore: IEnum;
  toBank: IEnum;
  toStore: IEnum;
  type: IEnum;
}
export interface IMovementTransactionTable extends IMovementTransaction {}
