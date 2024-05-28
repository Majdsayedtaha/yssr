import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class RegionActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'Region');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities('GetRegionsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IName>> {
    return this.readEntity('GetRegionInfo', id);
  }

  post(formData: any): Observable<IResponse<IName>> {
    return this.createEntity('AddRegion', formData, 'false');
  }

  put(id: string, formData: IName): Observable<IResponse<IName>> {
    return this.updateEntity('UpdateRegion', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IName>> {
    return this.deleteEntity('Delete', id);
  }
}
