import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ICountry } from '../models';

export class CountryActions extends CRUDService<ICountry, {}> {
  constructor(http: HttpClient) {
    super(http, 'Country');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<ICountry, {}>>> {
    return this.readPaginationEntities('GetCountriesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<ICountry>> {
    return this.readEntity('GetCountryInfo', id);
  }

  post(formData: any): Observable<IResponse<ICountry>> {
    return this.createEntity('AddCountry', formData, 'false');
  }

  put(id: string, formData: ICountry): Observable<IResponse<ICountry>> {
    return this.updateEntity('UpdateCountry', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<ICountry>> {
    return this.deleteEntity('Delete', id);
  }
}
