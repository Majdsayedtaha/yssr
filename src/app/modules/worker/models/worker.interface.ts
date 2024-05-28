import { IEnum } from "src/app/core/interfaces";

export interface IWorker {
  id: string;
  code: string;
  name: string;
  customerName: string;
  passportNo: string;
  isBlocked: boolean;
  residenceNo: string;
  externalOfficeName: string;
  nationality: string;
  jobName: string;
  cvType: string | IEnum;
  monthlySalary: number;
}



export interface IWorkerStatistics {
  totalCount: number,
  blockedCount: number
}


export interface IWorkerFormData extends IWorker {
  nameAr: string;
  nameEn: string;
  genderId: string;
  gender?: IEnum;
  birthDate: string;
  placeOfBirth: string;
  cvMobileFirst: string;
  cvMobileSecond: string;
  email: string;
  religion?: IEnum;
  religionId: string;
  maritalStatusId: string;
  maritalStatus?: IEnum;
  numberOfChildren: number;
  weight: number;
  tall: number;
  cvTypeId: string;
  passportNo: string;
  passportPlaceOfIssue: string;
  passportDateOfIssue: string;
  passportDateOfExpire: string;
  iqamaNumber: string;
  iqamaPlaceOfIssue: string;
  iqamaStartDate: string;
  iqamaExpireDate: string;
  borderNumber: string;
  workLicenseStartDate: string;
  workLicenseExpireDate: string;
  insuranceCompany: string;
  insuranceCategory: string;
  policyNumber: string;
  insuranceStartDate: string;
  insuranceExpireDate: string;
  yearsOfExperience: number;
  detailsOfExperience: string;
  educationalLevel: string;
  arabicLevelId: string;
  arabicLevel: IEnum;
  englishLevelId: string;
  englishLevel: IEnum;
  monthlySalary: number;
  relativeName: string;
  relativeType: string;
  relativePhone: string;
  relativeAddress: string;
  personalImage: string;
  personalImagePath: string;
  borderAndVisaImage: string;
  borderAndVisaImagePath: string;
  iqamaImage: string;
  iqamaImagePath: string;
  passportImage: string;
  passportImagePath: string;
  cvImage: string;
  cvImagePath: string;
  countryId: string;
  country?: IEnum;
  lastCountryId: string;
  lastCountry: IEnum
  jobId: string;
  job?: IEnum;
  externalOfficeId: string;
  externalOffice: IEnum;
  experienceTypeId: string;
  experienceType: IEnum;
  apartmentId?: string;
  apartment?: IEnum;
  detailsIds: string[];
  skillsIds: string[];
  cvTypeCheckedData?: boolean;
}


