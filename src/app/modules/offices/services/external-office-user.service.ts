import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExternalOfficeUserForm } from '../models';
import { ExternalOfficeUserActions } from '../actions/office-user.action';

@Injectable({ providedIn: 'root' })
export class ExternalOfficesUserService {
  private _externalOfficeUserActions: ExternalOfficeUserActions;
  private _externalOfficeUsersActions: ExternalOfficeUserActions;

  constructor(private _http: HttpClient) {
    this._externalOfficeUserActions = new ExternalOfficeUserActions(_http);
    this._externalOfficeUsersActions = new ExternalOfficeUserActions(_http);
  }

  addExternalOfficeUser(office: IExternalOfficeUserForm) {
    return this._externalOfficeUserActions.post(office);
  }

  getExternalOfficeUsers(formData: any, externalOfficeId: string) {
    return this._externalOfficeUsersActions.getExternalOfficeUsers(formData, externalOfficeId);
  }
}
