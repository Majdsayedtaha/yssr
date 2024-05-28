import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IResponse } from 'src/app/core/models';
import { Observable } from 'rxjs';
import { ILinkResume } from '../models';

export class LinkResumeActions extends CRUDService<ILinkResume> {
  constructor(http: HttpClient) {
    super(http, 'Worker');
  }

  getWorkersRecruitmentContract(id: string, page: number = 0): Observable<IResponse<ILinkResume[]>> {
    return this.readEntities(`GetWorkersForRecruitmentContract/${id}?PageSize=10&PageNumber=${page}`);
  }

  getSuggestedWorkersForRecruitmentContract(id: string, page: number = 0): Observable<IResponse<ILinkResume[]>> {
    return this.readEntities(`GetSuggestedWorkersForRecruitmentContract/${id}?PageSize=10&PageNumber=${page}`);
  }
}
