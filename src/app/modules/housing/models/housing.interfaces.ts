import { IEnum } from "src/app/core/interfaces";
import { IApartment } from "./apartment.interfaces";


export interface IHousing {
  id: string;
  name: string;
  apartmentsCount: number;
  address: string;
  capacity: number;
}

export interface IHousingStatistics {
  totalCount: number;
}


export interface IHousingFormData extends IHousing {
  code: number;
  name: string;
  street: string;
  streetEn: string;
  district: string;
  districtEn: string;
  city: string;
  region: string;
  postalCode: string;
  additionalCode: string;
  unitNumber: string;
  buildingNumber: string;
  location: string;
  apartments: IApartment[];
}

export interface IHouseWorkerFormData extends IHousing {
  workersIds: string[] | IEnum[];
  apartmentId: string;
  note?: string;
}
