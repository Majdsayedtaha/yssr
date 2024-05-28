import { IEnum } from 'src/app/core/interfaces';

export interface IRentPrice {
  jobId: number;
  countryId: number;
  prices: IRents[];
  job?: IEnum;
}
export interface IRents {
  id?: string;
  rentTypeId: string;
  price: number;
  rentType?: IEnum;
}
