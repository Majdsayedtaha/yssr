import { IEnum } from "src/app/core/interfaces";

export interface IBranch {
  id: string;
  nameAr: string;
  nameEn: string;
  creationDate: string;
  branchManager: IEnum;
  phone1: string;
  email1: string;
}
export interface IBranchForm extends IBranch {
  nameAr: string;
  nameEn: string;
  branchManagerId: string;
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
}
