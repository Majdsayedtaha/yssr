import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IRefund, IRefundProcedure, IRefundStatistics } from '../models';

export class RefundActions extends CRUDService<IRefund, IRefundStatistics> {
  constructor(http: HttpClient) {
    super(http, 'ReturnRequest');
  }

  post(formData: IRefund): Observable<IResponse<IRefund>> {
    return this.createEntity('AddReturnRequest', formData, 'false');
  }

  postProcedure(formData: IRefund): Observable<IResponse<IRefundProcedure>> {
    return this.createEntity('AddReturnRequestProcedure', formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IRefund, IRefundStatistics>>> {
    return this.readPaginationEntities('GetReturnRequests', formData);
  }

  delete(id: string): Observable<IResponse<IRefund>> {
    return this.deleteEntity('Delete', id);
  }

  getReturnRequestsSelect(): Observable<IResponse<any>> {
    return this.readPaginationEntities('GetReturnRequestsSelect');
  }

  getOrderDetails(id: string): Observable<IResponse<IRefund>> {
    return this.readEntity('GetReturnRequestInfo', id);
  }

  getReturnWorkersSelect(): Observable<IResponse<any>> {
    return this.readEntities('GetReturnRequestsSelect');
  }

  getLastProcedures(id: string): Observable<IResponse<any>> {
    return this.readEntities('GetLastProcedures/' + id);
  }
}
