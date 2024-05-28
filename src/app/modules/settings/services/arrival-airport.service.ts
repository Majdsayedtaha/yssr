import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArrivalAirport } from '../models';
import { ArrivalAirportActions } from '../actions/arrival-airport.action';

@Injectable({ providedIn: 'root' })
export class ArrivalAirportService {
  private _arrivalAirportActions: ArrivalAirportActions;

  constructor(private _http: HttpClient) {
    this._arrivalAirportActions = new ArrivalAirportActions(_http);
  }

  getArrivalAirports(formData: any) {
    return this._arrivalAirportActions.get(formData);
  }

  addArrivalAirport(AddArrivalAirport: IArrivalAirport) {
    return this._arrivalAirportActions.post(AddArrivalAirport);
  }

  updateArrivalAirport(id: string, formData: IArrivalAirport) {
    return this._arrivalAirportActions.put(id, formData);
  }

  deleteArrivalAirport(id: string) {
    return this._arrivalAirportActions.delete(id);
  }
}
