import { IPermission } from "../../settings/models";

export interface IUserAccount {
  id: string;
  userName: string;
  creationDate: string;
  role: string;
  phone1: string;
  email1: string;
}

export interface IUserTable {

}

export interface IUserAccountInfo {
  employeeId: string;
  userName: string;
  password?: any;
  permissions: IPermission[];
}

