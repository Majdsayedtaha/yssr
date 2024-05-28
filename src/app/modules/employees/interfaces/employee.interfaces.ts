import { IEnum } from 'src/app/core/interfaces';

export interface IEmployee {
  name?: string;
  nameEn: string;
  nameAr: string;
  phoneNumber: string;
  password: string;
  email: string;
  added_date: string;
  creationDate?: string;
  commissionHolderType: IEnum;
  commissionHolderTypeName?: string;
}
export interface ISettingEmployee {
  name?: string;
  nameEn: string;
  nameAr: string;
  phoneNumber: string;
  phoneNumber2: string;
  email: string;
  email2: string;
  employeeType: IEnum;
  commissionSections: ICommissionSection[];
}

export interface IEmployeeStatistics {
  total?: number | undefined;
}

export interface ISupervisor {
  id: string;
  userName: string;
  creationDate: string;
  phoneNumber: string;
  email: string;
  password: string;
}
export interface ICommissionSection {
  commissionType?: IEnum;
  section?: IEnum;
  country?: IEnum;
  countryId?: string;
  commissionTypeId: string;
  sectionId: string;
  commissionAmount: number;
  contractsCount: number;
}
