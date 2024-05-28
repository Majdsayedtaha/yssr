import { IEnum } from 'src/app/core/interfaces';

export interface IContract {
  code: string;
  connectedWithWorker: boolean | string;
  contractDate: string;
  country: any;
  customerName: string;
  id: string;
  job: any;
  lastProcedure: string;
  lastProcedureDate: string;
  musanedNo: string;
  totalWithTax: number;
  totalWithoutTax: number;
  visaNo: string;
  workerName: string;
}

export interface IContractStatistics {
  totalCount: number;
  withWorkersCount: number;
  withoutWorkersCount: number;
}
export interface IContractWarrantyStatistics {
  aboutToEndCount: number;
  extendedCount: number;
  newWarrantyCount: number;
}

export interface IContractFormData extends IContract {
  customerId: string;
  contractDateMilady: string;
  contractDateHijri: string;
  requestNumber: string;
  visaNo: string;
  visaTypeId: string;
  visaDateMilady: string;
  visaDateHijri: string;
  religionId: string;
  ageId: string;
  jobId: string;
  experienceTypeId: string;
  countryId: string;
  externalOfficeId: string;
  representativeId: string;
  externalOfficeAmount: number;
  arrivalStationId: string;
  skillsIds: string[];
  contractAmount: number;
  taxTypeId: string;
  discount: number;
  taxAmount: number;
  withoutTaxAmount: number;
  transportationAmount: number;
  musanedRequestTypeId: string;
  musanedRequestNum: string;
  musanedRequestAmount: number;
  employees: Employee[];
  saveWithSendEmail: boolean;
  saveWithSendSms: boolean;
  customer: IEnum;
  visaType: IEnum;
  religion: IEnum;
  age: IEnum;
  experienceType: IEnum;
  externalOffice: IEnum;
  representative: IEnum;
  arrivalStation: IEnum;
  taxType: IEnum;
  musanedRequestType: IEnum;
}
export interface IContractProcedure extends IContract {
  id: string;
  procedure: IEnum;
  status: IEnum;
  procedureDate: string;
  note: string;
}
export interface ILinkResume {
  id: string;
  childrenCount: string;
  maritalStatus: string;
  birthDate: string;
  arName: string;
  connectedWithContract: boolean;
  loading?: boolean;
  sameExperienceType?: boolean;
  sameExternalOffice?: boolean;
  sameJob?: boolean;
  sameReligion?: boolean;
  experienceType?: IEnum;
  externalOffice?: IEnum;
  job?: IEnum;
  religion?: IEnum;
  personalImagePath?: string;
}
interface Employee {
  employeeId: string;
  amount: number;
  employeeName?: string;
}
