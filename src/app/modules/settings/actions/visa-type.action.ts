import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class VisaTypeActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'VisaType');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities('GetVisaTypesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IName>> {
    return this.readEntity('GetVisaTypeInfo', id);
  }

  post(formData: any): Observable<IResponse<IName>> {
    return this.createEntity('AddVisaType', formData, 'false');
  }

  put(id: string, formData: IName): Observable<IResponse<IName>> {
    return this.updateEntity('UpdateVisaType', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IName>> {
    return this.deleteEntity('Delete', id);
  }
}
