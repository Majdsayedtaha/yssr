import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICity } from '../models';
import { CityActions } from '../actions/city.action';

@Injectable({ providedIn: 'root' })
export class CityService {
  private _cityActions: CityActions;
  constructor(private _http: HttpClient) {
    this._cityActions = new CityActions(_http);
  }

  getCities(formData: any) {
    return this._cityActions.get(formData);
  }

  getCityInfo(id: string) {
    return this._cityActions.getInfo(id);
  }

  addCity(addCity: ICity) {
    return this._cityActions.post(addCity);
  }

  updateCity(id:string,formData:ICity) {
    return this._cityActions.put(id,formData);
  }

  deleteCity(id:string) {
    return this._cityActions.delete(id);
  }
}
