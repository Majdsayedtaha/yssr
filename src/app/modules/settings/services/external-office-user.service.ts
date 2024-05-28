import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalOfficeUserActions } from '../actions/external-office-user.action';

@Injectable({ providedIn: 'root' })
export class ExternalOfficeUserService {
  private _externalActions: ExternalOfficeUserActions;

  constructor(private _http: HttpClient) {
    this._externalActions = new ExternalOfficeUserActions(_http);
  }

  getRepresentativesSelect(id: string, value?: string, page?: number) {
    return this._externalActions.getRepresentativesSelect(id, value, page);
  }
}
