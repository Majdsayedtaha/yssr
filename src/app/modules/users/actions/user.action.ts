import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IUserTable } from '../models';

export class UserActions extends CRUDService<IUserTable, {}> {
  constructor(http: HttpClient) {
    super(http, 'User');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IUserTable, {}>>> {
    return this.readPaginationEntities('GetUsers', formData);
  }
  getInfo(id: string): Observable<IResponse<IUserTable>> {
    return this.readEntity('GetUserInfo', id);
  }

  getUsersSelect(): Observable<IResponse<any>> {
    return this.readEntities('GetUsersSelect');
  }

  post(formData: IUserTable): Observable<IResponse<IUserTable>> {
    return this.createEntity('AddUser', formData, 'false');
  }

  put(id: string, formData: IUserTable): Observable<IResponse<IUserTable>> {
    return this.updateEntity('UpdateUser', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IUserTable>> {
    return this.deleteEntity('Delete', id);
  }
}
