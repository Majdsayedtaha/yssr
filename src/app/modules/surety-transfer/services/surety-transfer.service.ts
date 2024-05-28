import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuretyTransferAction } from '../actions/surety-transfer.actions';
@Injectable({
  providedIn: 'root',
})
export class SuretyTransferService {
  orderId = new Subject<string | null>();
  private _suretyTransferActions!: SuretyTransferAction;

  constructor(private _http: HttpClient) {
    this._suretyTransferActions = new SuretyTransferAction(_http);
  }

  getCompletedOrders(formParams: any) {
    return this._suretyTransferActions.get(formParams);
  }

  fetchOrderInfo(id: string) {
    return this._suretyTransferActions.getInfo(id);
  }

  fetchNumbersByType(id: string, query?: any) {
    return this._suretyTransferActions.getByType(id, query);
  }

  createSponsorshipTransferRequest(formData: any) {
    return this._suretyTransferActions.create(formData);
  }

  updateRequest(formData: any, id: string) {
    return this._suretyTransferActions.update(id, formData);
  }

  deleteRequest(id: string) {
    return this._suretyTransferActions.delete(id);
  }

  getRequestTotalTax(id: string, formData: any) {
    return this._suretyTransferActions.calculateTax(id, formData);
  }
  getOldSponsor(orderId: string, transferTypeId: any) {
    return this._suretyTransferActions.getOldSponsor(orderId, transferTypeId);
  }
}
