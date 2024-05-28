import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IName } from '../models';
import { VisaTypeActions } from '../actions/visa-type.action';

@Injectable({ providedIn: 'root' })
export class VisaTypeService {
  private _visaTypeActions: VisaTypeActions;

  constructor(private _http: HttpClient) {
    this._visaTypeActions = new VisaTypeActions(_http);
  }

  getVisaTypes(formData: any) {
    return this._visaTypeActions.get(formData);
  }

  getVisaTypeInfo(id: string) {
    return this._visaTypeActions.getInfo(id);
  }

  addVisaType(addVisaType: IName) {
    return this._visaTypeActions.post(addVisaType);
  }

  updateVisaType(id: string,formData:IName) {
    return this._visaTypeActions.put(id,formData);
  }

  deleteVisaType(id: string) {
    return this._visaTypeActions.delete(id);
  }
}
