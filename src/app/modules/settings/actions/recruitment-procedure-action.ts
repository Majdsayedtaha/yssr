import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IRecruitmentProcedure } from '../models';

export class RecruitmentProceduresActions extends CRUDService<IRecruitmentProcedure> {
  constructor(http: HttpClient) {
    super(http, 'Procedure');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IRecruitmentProcedure, {}>>> {
    return this.readPaginationEntities('GetProceduresTable', formData);
  }

  post(formData: any): Observable<IResponse<IRecruitmentProcedure>> {
    return this.createEntity('AddProcedure', formData, 'false');
  }

  put(id: string, formData: IRecruitmentProcedure): Observable<IResponse<IRecruitmentProcedure>> {
    return this.updateEntity('UpdateProcedure', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IRecruitmentProcedure>> {
    return this.deleteEntity('Delete', id);
  }
}
