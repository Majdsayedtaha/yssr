import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBranch, IBranchForm } from '../models';

export class BranchActions extends CRUDService<IBranch, {}> {
  constructor(http: HttpClient) {
    super(http, 'Branch');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBranch, {}>>> {
    return this.readPaginationEntities('GetBranches', formData);
  }
  getInfo(id: string): Observable<IResponse<IBranch>> {
    return this.readEntity('GetBranchInfo', id);
  }

  post(formData: IBranchForm): Observable<IResponse<IBranch>> {
    return this.createEntity('AddBranch', formData, 'false');
  }

  put(id: string, formData: IBranch): Observable<IResponse<IBranch>> {
    return this.updateEntity('UpdateBranch', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IBranch>> {
    return this.deleteEntity('Delete', id);
  }

  getManager(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBranch, {}>>> {
    return this.readPaginationEntities('GetBranchesManagers', formData);
  }
  getManagerInfo(id: string): Observable<IResponse<IBranch>> {
    return this.readEntity('GetBranchManagerInfo', id);
  }

  postManager(formData: IBranch): Observable<IResponse<IBranch>> {
    return this.createEntity('AddBranchManager', formData, 'false');
  }
  putManager(id: string, formData: IBranch): Observable<IResponse<IBranch>> {
    return this.updateEntity('UpdateBranchManager', id, formData);
  }

  deleteManager(id: string): Observable<IResponse<IBranch>> {
    return this.deleteEntity('Delete', id);
  }
}
