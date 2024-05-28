import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { VisaActions } from '../../actions/settings/visa.actions';


@Injectable({ providedIn: 'root' })
export class VisaService {
  private _visaActions: VisaActions;

  constructor(private _http: HttpClient) {
    this._visaActions = new VisaActions(_http);
  }

  visaTypes(): Observable<IResponse<IEnum[]>> {
    return this._visaActions.getVisaTypes();
  }
}
