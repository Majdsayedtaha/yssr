import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IResponse } from 'src/app/core/models';
import { Observable } from 'rxjs';
import { ILinkResumeWaiver } from '../models';

export class LinkResumeWaiverActions extends CRUDService<ILinkResumeWaiver> {
  constructor(http: HttpClient) {
    super(http, 'Worker');
  }

  getWorkersForExternalWaiver(id: string, page: number = 0): Observable<IResponse<ILinkResumeWaiver[]>> {
    return this.readEntities(`GetWorkersForExternalWaiver/${id}?PageSize=10&PageNumber=${page}`);
  }

  getSuggestedWorkersForExternalWaiver(id: string, page: number = 0): Observable<IResponse<ILinkResumeWaiver[]>> {
    return this.readEntities(`GetSuggestedWorkersForExternalWaiver/${id}?PageSize=10&PageNumber=${page}`);
  }
}
