import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { RefundActions } from '../actions/refund.actions';
import { IRefund, IRefundProcedure, IRefundStatistics } from '../models';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class RefundService {

  private _refundActions: RefundActions;

  updateStatistics = new BehaviorSubject<IRefundStatistics | null>(null);
  sideOrderDetails = new BehaviorSubject<IRefund | null>(null);
  sideAddProcedure = new BehaviorSubject<any | null>(null);
  sideLogProcedure = new BehaviorSubject<IRefund | null>(null);
  sidenavAddProcedure = new BehaviorSubject<MatSidenav | null>(null);

  constructor(private _http: HttpClient) {
    this._refundActions = new RefundActions(_http);
  }

  addOrders(formParams: IRefund) {
    return this._refundActions.post(formParams);
  }

  addProcedure(formParams: IRefund) {
    return this._refundActions.postProcedure(formParams);
  }

  getRefundsList(formParams: any) {
    return this._refundActions.get(formParams);
  }

  deleteOrders(id: string) {
    return this._refundActions.delete(id);
  }

  getReturnRequestsSelect() {
    return this._refundActions.getReturnRequestsSelect();
  }

  getOrderDetails(id: string) {
    return this._refundActions.getOrderDetails(id);
  }

  getReturnWorkersSelect() {
    return this._refundActions.getReturnWorkersSelect();
  }

  getLastProcedures(returnWorkerId: string) {
    return this._refundActions.getLastProcedures(returnWorkerId);
  }

}
