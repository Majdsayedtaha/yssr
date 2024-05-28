import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IProject, IProjectStatistics } from '../models/project.interface';

export class ProjectAction extends CRUDService<IProject, IProjectStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Project');
  }

  add(formData: IProject): Observable<IResponse<IProject>> {
    return this.createEntity('AddProject', formData, 'true');
  }
  put(id: string, formData: IProject): Observable<IResponse<IProject>> {
    return this.updateEntity('UpdateProject', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IProject, IProjectStatistics>>> {
    return this.readPaginationEntities('GetTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IProject>> {
    return this.readEntity('GetInfo', id);
  }
  delete(id: string): Observable<IResponse<IProject>> {
    return this.deleteEntity('Delete', id);
  }
}
