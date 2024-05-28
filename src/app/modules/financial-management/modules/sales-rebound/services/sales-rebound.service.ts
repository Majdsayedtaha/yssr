import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SalesReturnActions } from '../actions/return.action';

@Injectable({ providedIn: 'root' })
export class SalesReboundService {
  sideData = new BehaviorSubject<any>(null);
  private _salesReturnActions: SalesReturnActions;

  constructor(private _http: HttpClient) {
    this._salesReturnActions = new SalesReturnActions(_http);
  }
  addReturnSales(newReturnSales: any) {
    return this._salesReturnActions.add(newReturnSales);
  }

  updateReturnSales(returnSalesId: string, updatedReturnSales: any) {
    return this._salesReturnActions.put(returnSalesId, updatedReturnSales);
  }
  getReturnSalesList(formParams: any) {
    return this._salesReturnActions.get(formParams);
  }

  getReturnSalesDetails(returnSalesId: string) {
    return this._salesReturnActions.getInfo(returnSalesId);
  }
  getMainBillsSelect(formParams: any) {
    return this._salesReturnActions.getMainBillsSelect(formParams);
  }

  deleteReturnSales(returnSalesId: string) {
    return this._salesReturnActions.delete(returnSalesId);
  }

  getReturnRequestServices(returnSalesId: string) {
    return this._salesReturnActions.getReturnRequestServices(returnSalesId);
  }
}
