import { IEnum } from "src/app/core/interfaces";

export interface IWaiverSpecificationRequest {
  requestDate: string;
  requestNumber: string;

  religion?: IEnum;
  religionId: string;

  age?: IEnum;
  ageId: string;

  country?: IEnum;
  countryId: string;

  jobId: string;
  job?: IEnum;

  personalPhoto?: string;
  personalPhotoUrl?: string;

  visaAndBorderNumber?: string;
  visaAndBorderNumberUrl?: string;

  residence?: string;
  residenceUrl?: string;

  passport?: string;
  passportUrl?: string;

  cv?: string;
  cvUrl?: string;

  skillsIds?: string[];
  note: string;
}

export interface IWaiverSpecification {
  requestNumber: string;
  requestDate: string;
  religion: string;
  job: string;
  age: string;
  country: string;
}
