import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalOfficeActions } from '../actions/office.action';
import { BehaviorSubject } from 'rxjs';
import { IExternalOffice, IExternalOfficeForm } from '../models';

@Injectable({ providedIn: 'root' })
export class ExternalOfficesService {
  private _externalOfficeActions: ExternalOfficeActions;

  sideOfficeDetails = new BehaviorSubject<string | null>(null);
  sideAddPrice = new BehaviorSubject<IExternalOffice | null>(null);

  constructor(private _http: HttpClient) {
    this._externalOfficeActions = new ExternalOfficeActions(_http);
  }

  getExternalOffices(formData: any) {
    return this._externalOfficeActions.get(formData);
  }

  getExternalOfficeInfo(id: string) {
    return this._externalOfficeActions.getInfo(id);
  }

  addExternalOffice(office: IExternalOfficeForm) {
    return this._externalOfficeActions.post(office);
  }

  updateExternalOffice(id: string, formData: IExternalOffice) {
    return this._externalOfficeActions.put(id, formData);
  }

  deleteExternalOffice(id: string) {
    return this._externalOfficeActions.delete(id);
  }
}
