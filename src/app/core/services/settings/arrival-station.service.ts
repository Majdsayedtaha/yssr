import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { ArrivalStationActions } from '../../actions/settings/arrival-station.actions';

@Injectable({ providedIn: 'root' })
export class ArrivalStationService {
  private _arrivalStationActions: ArrivalStationActions;

  constructor(private _http: HttpClient) {
    this._arrivalStationActions = new ArrivalStationActions(_http);
  }

  arrivalStations(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this._arrivalStationActions.getArrivalStations(value, page);
  }
}
