import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExternalOfficeActions } from '../../actions/settings/external-office.actions';

@Injectable({ providedIn: 'root' })
export class ExternalOfficeService {
  private _actions: ExternalOfficeActions;

  constructor(private _http: HttpClient) {
    this._actions = new ExternalOfficeActions(_http);
  }

  createExternalOffice(formData: any): Observable<any> {
    return this._actions.add(formData);
  }

  externalOfficeData(value?: string, page?: number, queryParams?: any): Observable<any> {
    return this._actions.get(value, page, queryParams);
  }
}
