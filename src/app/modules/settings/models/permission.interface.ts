import { IRoleEnum } from "src/app/core/constants";

export interface IPermission {
  id: string;
  canView: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  all?: boolean;
  name: string;
  value: IRoleEnum;
}
