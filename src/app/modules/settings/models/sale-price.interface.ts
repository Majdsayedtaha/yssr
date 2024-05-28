import { IEnum } from 'src/app/core/interfaces';

export interface ISalePrice {
  recruitmentSalary: number;
  recruitmentPeriod: number;
  countryId: string;
  prices: IPrice[];
}
export interface IPrice {
  monthlySalary: number;
  price: number;
  religionId: string | IEnum;
  jobId: string | IEnum;
  experienceTypeId: string | IEnum;
  religion: IEnum;
  job: IEnum;
  experienceType: IEnum;
  id?: string;
}
