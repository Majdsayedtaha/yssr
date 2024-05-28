import { IEnum } from 'src/app/core/interfaces';

export interface IBenefit {
  amount: number;
  benefitType: IEnum;
  benefitTypeId: string;
  daysWithoutWork: number;
  worker: IEnum;
  date?: string;
  workerId: string;
}

export interface IBenefitRow {
  worker: string;
  benefitType: string;
  amount: number;
}
