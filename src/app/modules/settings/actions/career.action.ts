import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class CareerActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'Job');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities('GetJobsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IName>> {
    return this.readEntity('GetCountryInfo', id);
  }

  post(formData: any): Observable<IResponse<IName>> {
    return this.createEntity('AddJob', formData, 'false');
  }

  put(id: string, formData: IName): Observable<IResponse<IName>> {
    return this.updateEntity('UpdateJob', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IName>> {
    return this.deleteEntity('Delete', id);
  }
}
