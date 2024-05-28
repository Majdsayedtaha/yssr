import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IExternalOfficeUserForm } from '../models';

export class ExternalOfficeUserActions extends CRUDService<IExternalOfficeUserForm, {}> {
  constructor(http: HttpClient) {
    super(http, 'ExternalOfficeUser');
  }

  post(formData: IExternalOfficeUserForm): Observable<IResponse<IExternalOfficeUserForm>> {
    return this.createEntity('AddExternalOfficeUser', formData, 'false');
  }

  getExternalOfficeUsers(
    formData: { [key: string]: string },
    id: string
  ): Observable<IResponse<IPagination<IExternalOfficeUserForm, {}>>> {
    return this.readPaginationEntities('GetExternalOfficeUsersTable/' + id, formData);
  }
}
