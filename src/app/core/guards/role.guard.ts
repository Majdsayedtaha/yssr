import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { IPermission } from 'src/app/modules/settings/models';
import { IRoleEnum, IRolePermissionsEnum } from '../constants';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';

export const roleGuard = (next: ActivatedRouteSnapshot) => {
  const dataPermissions: IPermission[] = inject(StorageService).getLocalObject('dataPermissions');
  const role: IRoleEnum = next.data['roleAccessor'];
  const roleActions: IRolePermissionsEnum[] = next.data['roleActions'];
  const isAuthorized =
    dataPermissions.findIndex(
      (permission: IPermission) => permission.value == role && checkIfOneOfActionMeet(roleActions, permission)
    ) != -1;
  return !isAuthorized ? createUrlTreeFromSnapshot(next, ['/', 'not-authorized']) : true;
};

function checkIfOneOfActionMeet(authActions: IRolePermissionsEnum[], permission: IPermission) {
  let authorized = false;
  authActions.forEach(authAction => (permission[authAction] ? (authorized = true) : ''));
  return authorized;
}
