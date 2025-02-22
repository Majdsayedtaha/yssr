import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class ExperienceTypeActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'ExperienceType');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities('GetExperienceTypesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IName>> {
    return this.readEntity('GetExperienceTypeInfo', id);
  }

  post(formData: any): Observable<IResponse<IName>> {
    return this.createEntity('AddExperienceType', formData, 'false');
  }

  put(id: string, formData: IName): Observable<IResponse<IName>> {
    return this.updateEntity('UpdateExperienceType', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IName>> {
    return this.deleteEntity('Delete', id);
  }
}
