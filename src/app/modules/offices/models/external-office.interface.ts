import { IEnum } from 'src/app/core/interfaces';

export interface IExternalOffice {
  nameEn: string;
  nameAr: string;
  country:IEnum;
  phoneFirst: string;
  emailFirst: string;
  code: string;
  id: string;
  office: IEnum;
  agreementPrice: number;

}
export interface IExternalOfficeForm extends IExternalOffice {
  nameAr: string;
  nameEn: string;
  countryId: string;
  licenseNo: string;
  phoneFirst: string;
  phoneSecond: string;
  emailFirst: string;
  emailSecond: string;
  workPhoneNumber: string;
}
