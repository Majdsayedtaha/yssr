import { Observable } from 'rxjs';
import { IWaiverRequest } from '../models';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';

export class WaiverActions extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'WaiverRequest');
  }

  getRequests(formData: any): Observable<any> {
    return this.readPaginationEntities('GetAll', formData);
  }

  getInfo(Id: string): Observable<any> {
    return this.readEntity('GetWaiverRequestInfo', Id);
  }

  calculateTax(Id: string, formData: any) {
    return this.readEntity('GetRequestTotalWithTax', Id, formData);
  }

  getLastProcedures(id: string): Observable<IResponse<any>> {
    return this.readEntities(`GetLastProcedures/${id}`);
  }

  create(formData: any): Observable<IResponse<IWaiverRequest>> {
    return this.createEntity('AddWaiverRequest', formData, 'false');
  }

  update(Id: string, formData: any): Observable<IResponse<IWaiverRequest>> {
    return this.updateEntity('UpdateWaiverRequest', Id, formData, 'false');
  }

  delete(workerId: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', workerId);
  }

  createWaiverProcedure(formData: any): Observable<IResponse<any>> {
    return this.createEntity('LinkToProcedure', formData, 'false');
  }

  getWaiverRequestsSelect(value?: string, page?: number) {
    return this.readEntities(`GetWaiverRequestsSelect`, {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }
}
