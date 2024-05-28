import { IEnum } from "src/app/core/interfaces";

export interface IWaiverRequest {
  requestDate: string;
  requestNumber: string;
  worker?: { id: string; name: string };
  workerId: string;
  customer?: { id: string; name: string };
  customerId: string;
  taxType?: { id: string; name: string };
  taxTypeId: string;
  taxAmount: number;
  transferAmount: number;
  visaNumber: string;
  arrivalDate: string;
  note: string;
}

export interface IWaiver extends IWaiverRequest {
  requestNumber: string;
  requestDate: string;
  customerName: string;
  workerName: string;
  nationality: string;
  sponsorshipTransferred: boolean | string;
}
export interface IWaiverStatistics {
  totalCount: number;
  withWorkersCount: number;
  withoutWorkersCount: number;
}
export interface ILinkResumeWaiver {
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
}
