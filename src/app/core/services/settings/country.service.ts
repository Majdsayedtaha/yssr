import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountryActions } from '../../actions/settings/country.actions';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private _action: CountryActions;

  constructor(private _http: HttpClient) {
    this._action = new CountryActions(_http);
  }

  createCountry(formData: any): Observable<any> {
    return this._action.add(formData);
  }

  getCountries(value?: string, page?: number): Observable<any> {
    return this._action.get(value, page);
  }
}
