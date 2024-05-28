import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IExternalOffice, IExternalOfficeForm } from '../models';

export class ExternalOfficeActions extends CRUDService<IExternalOffice, {}> {
  constructor(http: HttpClient) {
    super(http, 'ExternalOffice');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IExternalOffice, {}>>> {
    return this.readPaginationEntities('GetExternalOfficesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IExternalOffice>> {
    return this.readEntity('GetExternalOfficeInfo', id);
  }

  post(formData: IExternalOfficeForm): Observable<IResponse<IExternalOffice>> {
    return this.createEntity('AddExternalOffice', formData, 'false');
  }

  put(id: string, formData: IExternalOffice): Observable<IResponse<IExternalOffice>> {
    return this.updateEntity('UpdateExternalOffice', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IExternalOffice>> {
    return this.deleteEntity('Delete', id);
  }
}
