import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IName } from '../models';

export class SkillActions extends CRUDService<IName, {}> {
  constructor(http: HttpClient) {
    super(http, 'Skill');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IName, {}>>> {
    return this.readPaginationEntities('GetSkillsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IName>> {
    return this.readEntity('GetSkillInfo', id);
  }

  post(formData: any): Observable<IResponse<IName>> {
    return this.createEntity('AddSkill', formData, 'false');
  }

  put(id: string, formData: IName): Observable<IResponse<IName>> {
    return this.updateEntity('UpdateSkill', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IName>> {
    return this.deleteEntity('Delete', id);
  }
}
