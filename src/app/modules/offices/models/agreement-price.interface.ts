import { IEnum } from 'src/app/core/interfaces';

export interface IAgreementPriceForm {
  externalOfficeId: string;
  jobId: string | IEnum;
  experienceTypeId: string | IEnum;
  religionId: string | IEnum;
  agreementPrice?: string;
  recruitmentPeriod?: string;
}

export interface IAgreementPriceRow {
  religionId: string | IEnum;
  religion?: IEnum;
  agreementPrice: number;
  recruitmentPeriod: number;
  jobId: string | IEnum;
  job?: IEnum;
  experienceTypeId: string | IEnum;
  experienceType?: IEnum;
  id?: string;
}
