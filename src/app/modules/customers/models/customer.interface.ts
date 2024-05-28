import { IEnum } from 'src/app/core/interfaces';
import { IBusiness } from './business.interface';

export interface ICustomer {
  id: string;
  name: string;
  code: string;
  creationDate: string;
  phone1: string;
  identificationNumber: string;
  cityId: string;
  city?: IEnum;
  street: string;
  streetEn: string;
  district: string;
  districtEn: string;
  address: string;
  isBlocked: boolean | string;
  homeWorkersCount: number;
}
export interface ICustomerFormData extends ICustomer {
  nameAr: string;
  nameEn: string;
  birthDateMilady: string;
  birthDateHijri: any;
  identificationTypeId: string;
  identificationNumber: string;
  identificationExpireDate: string;
  identificationExpireDateHijri: any;
  phone1: string;
  phone2: string;
  email: string;
  maritalStatusId: string;
  financialStatusId: string;
  homeTypeId: string;
  workersCount: number;
  customerTypeId: string;
  business: IBusiness[];
  street: string;
  district: string;
  address: string;
  cityId: string;
  regionId: string;
  postalCode: string;
  additionalCode: string;
  unitNumber: string;
  buildingNumber: string;
  customerJob: string;
  customerPosition: string;
  workTel: string;
  monthlyIncome: number;
  relativeName: string;
  relativeType: string;
  relativePhone: string;
  vatProcessId: string;
  vipCustomer: boolean;
  familyMembersCount: number;
  // We use it when get details as object (id, name)
  identificationType: IEnum;
  maritalStatus: IEnum;
  financialStatus: IEnum;
  homeType: IEnum;
  customerType: IEnum;
  region: IEnum;
  vatProcess: IEnum;
  city: IEnum;
}
export interface ICustomerStatistics {
  blockedCustomersCount: number;
  vipCustomersCount: number;
  totalCustomersCount: number;
}
