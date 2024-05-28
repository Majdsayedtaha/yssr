import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PositionsActions } from '../actions/position.action';
@Injectable({ providedIn: 'root' })
export class PositionsService {
  private _templateActions: PositionsActions;

  constructor(private _http: HttpClient) {
    this._templateActions = new PositionsActions(_http);
  }

  //#region Position
  getRolesTable(formData?: any) {
    return this._templateActions.getRolesTable(formData);
  }

  addRole(formData: any) {
    return this._templateActions.addRole(formData);
  }

  updateRole(formData: any, id: string) {
    return this._templateActions.updateRole(formData, id);
  }

  deleteRole(id: string) {
    return this._templateActions.deleteRole(id);
  }

  getRoleInfo(Id: string) {
    return this._templateActions.getRoleInfo(Id);
  }
  //#endregion
}
