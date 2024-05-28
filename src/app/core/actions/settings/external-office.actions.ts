import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../../interfaces';

export class ExternalOfficeActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'ExternalOffice');
  }

  get(value?: string, page?: number, queryParams?: any): Observable<IResponse<IEnum[]>> {
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] == null || queryParams[key] == '') delete queryParams[key];
      });
    }

    return this.readEntities('GetExternalOffices', {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
      ...queryParams,
    });
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddExternalOffice', formData, 'false');
  }
}
