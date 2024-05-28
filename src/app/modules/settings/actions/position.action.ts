import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../../core/interfaces';
import { IPagination, IResponse } from '../../../core/models';
import { CRUDService } from '../../../core/services/crud.service';

export class PositionsActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Role');
  }
  // #region Position
  getRolesTable(formData: any): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetRolesTable', formData);
  }

  addRole(formData: any) {
    return this.createEntity('AddRole', formData, 'false');
  }

  updateRole(formData: any, Id: string) {
    return this.updateEntity('UpdateRole', Id, formData, 'false');
  }

  deleteRole(id: string) {
    return this.deleteEntity('Delete', id);
  }

  getRoleInfo(Id: string) {
    return this.readEntity('GetRoleInfo', Id);
  }
  //#endregion
}
