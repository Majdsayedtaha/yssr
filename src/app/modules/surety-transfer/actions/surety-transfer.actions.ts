import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';

export class SuretyTransferAction extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'SponsorshipTransfer');
  }

  get(formData: any): Observable<any> {
    return this.readPaginationEntities('GetSponsorshipTransferRequests', formData);
  }

  getInfo(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetSponsorshipTransferRequestInfo', id);
  }

  getByType(id: string, query?: any): Observable<IResponse<any>> {
    return this.readEntities(`GetRequestsNumbersByType/${id}`, query);
  }

  calculateTax(Id: string, formData: any) {
    return this.readEntity('GetRequestTotalWithTax', Id, formData);
  }

  create(formData: any): Observable<IResponse<any>> {
    return this.createEntity('AddSponsorshipTransferRequest', formData, 'false');
  }

  update(Id: string, formData: any): Observable<IResponse<any>> {
    return this.updateEntity('UpdateSponsorshipTransferRequest', Id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', id);
  }

  getOldSponsor(orderId: string, transferTypeId: any) {
    return this.readEntity(`GetOldSponsor/${orderId}?sponsorshipTransferTypeId=${transferTypeId}`);
  }
}
