import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ICity } from '../models';

export class CityActions extends CRUDService<ICity, {}> {
  constructor(http: HttpClient) {
    super(http, 'City');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<ICity, {}>>> {
    return this.readPaginationEntities('GetCitiesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<ICity>> {
    return this.readEntity('GetCityInfo', id);
  }

  post(formData: any): Observable<IResponse<ICity>> {
    return this.createEntity('AddCity', formData, 'false');
  }

  put(id: string, formData: ICity): Observable<IResponse<ICity>> {
    return this.updateEntity('UpdateCity', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<ICity>> {
    return this.deleteEntity('Delete', id);
  }
}
