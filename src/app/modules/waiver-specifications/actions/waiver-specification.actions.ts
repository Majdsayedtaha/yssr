import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';

export class WaiverSpecificationAction extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'ExternalWaiverRequest');
  }

  get(formData: any): Observable<any> {
    return this.readPaginationEntities('GetExternalWaiverRequests', formData);
  }

  getInfo(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetExternalWaiverRequestInfo', id);
  }

  getByType(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetRequestsNumbersByType', id);
  }

  create(formData: any): Observable<IResponse<any>> {
    return this.createEntity('AddExternalWaiverRequest', formData, 'false');
  }

  update(Id: string, formData: any): Observable<IResponse<any>> {
    return this.updateEntity('UpdateExternalWaiverRequest', Id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', id);
  }

  putLinkExternal(formData: any): Observable<IResponse<any>> {
    return this.updateEntity('LinkToWorker', '', formData, 'false');
  }
}
