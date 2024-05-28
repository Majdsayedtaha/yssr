import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { RegionActions } from '../../actions/settings/region.actions';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private _regionActions: RegionActions;

  constructor(private _http: HttpClient) {
    this._regionActions = new RegionActions(_http);
  }

  getRegions(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this._regionActions.getRegions(value, page);
  }
}
