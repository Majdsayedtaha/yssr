import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTable } from '../models';
import { BehaviorSubject } from 'rxjs';
import { UserActions } from '../actions/user.action';
import { PermissionActions } from '../../auth/actions/permission.actions';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _userActions: UserActions;
  private _permissionActions: PermissionActions;

  sideUserDetails = new BehaviorSubject<IUserTable | null>(null);

  constructor(private _http: HttpClient) {
    this._userActions = new UserActions(_http);
    this._permissionActions = new PermissionActions(_http);
  }

  addUser(formParams: IUserTable) {
    return this._userActions.post(formParams);
  }

  getUsersList(formParams: any) {
    return this._userActions.get(formParams);
  }

  getUsersSelect() {
    return this._userActions.getUsersSelect();
  }

  updateUser(id: string, formData: IUserTable) {
    return this._userActions.put(id, formData);
  }

  getUserInfo(id: string) {
    return this._userActions.getInfo(id);
  }

  deleteUser(id: string) {
    return this._userActions.delete(id);
  }

  updateUserPermissions(data: any) {
    return this._permissionActions.updateUserPermissions(data);
  }
}
