import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICountry } from '../models';
import { CountryActions } from '../actions/country.action';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private _CountryActions: CountryActions;

  constructor(private _http: HttpClient) {
    this._CountryActions = new CountryActions(_http);
  }

  getCountries(formData: any) {
    return this._CountryActions.get(formData);
  }

  getCountryInfo(id: string) {
    return this._CountryActions.getInfo(id);
  }

  addCountry(addCountry: ICountry) {
    return this._CountryActions.post(addCountry);
  }

  updateCountry(id: string,formData:ICountry) {
    return this._CountryActions.put(id,formData);
  }

  deleteCountry(id: string) {
    return this._CountryActions.delete(id);
  }
}
