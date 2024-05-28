import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CityActions } from '../../actions/settings/city.actions';

@Injectable({ providedIn: 'root' })
export class CityService {
  private _cityActions: CityActions;

  constructor(private _http: HttpClient) {
    this._cityActions = new CityActions(_http);
  }

  getRegionCities(id: string, value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this._cityActions.getRegionCities(id, value, page);
  }
}
