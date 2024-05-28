import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IPermission } from '../../settings/models';

export class PermissionActions extends CRUDService<IUser> {
  constructor(http: HttpClient) {
    super(http, 'Permission');
  }

  getUserPermission() {
    return this.readEntity('GetUserContents');
  }

  GetRolesSelect(value?: string, page?: number): Observable<any> {
    return this.readEntities('GetRolesSelect', {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  setRolePermissions(formData: any): Observable<any> {
    return this.createEntity('SetRolePermissions', formData, 'false');
  }

  getRoleContents(id: string): Observable<any> {
    return this.readEntity('GetRoleContents', id);
  }

  updateUserPermissions(data: any) {
    return this.createEntity('SetUserPermissions', data);
  }
}
