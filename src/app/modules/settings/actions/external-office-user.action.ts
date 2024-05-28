import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class ExternalOfficeUserActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'ExternalOfficeUser');
  }

  getRepresentativesSelect(id: string, value?: string, page?: number): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities(`GetRepresentativesSelect/${id}`, {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }
}
