import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PermissionActions } from 'src/app/modules/auth/actions/permission.actions';
import { IPermission } from 'src/app/modules/settings/models';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  permissions = new BehaviorSubject<any>(null);
  rolePermissions!: IPermission[];
  private _permissionActions: PermissionActions;

  constructor(_http: HttpClient) {
    this._permissionActions = new PermissionActions(_http);
  }

  getUserPermissions() {
    return this._permissionActions.getUserPermission();
  }

  getAllRoles(value?: string, page?: number) {
    return this._permissionActions.GetRolesSelect(value, page);
  }

  getContentsByRoleId(Id: string) {
    return this._permissionActions.getRoleContents(Id);
  }

  saveRolePermissions(roleId: string, permissions: IPermission[]) {
    const formData = {
      roleId: roleId,
      contents: permissions,
    };
    return this._permissionActions.setRolePermissions(formData);
  }
}
