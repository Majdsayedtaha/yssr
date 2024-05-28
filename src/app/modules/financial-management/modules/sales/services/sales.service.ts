import { Injectable } from '@angular/core';
import { SalesActions } from '../actions/sales.action';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class SalesService {
  private _salesActions: SalesActions;

  constructor(private _http: HttpClient) {
    this._salesActions = new SalesActions(_http);
  }

  addSales(newSales: any) {
    return this._salesActions.add(newSales);
  }

  updateSales(salesId: string, updatedSales: any) {
    return this._salesActions.put(salesId, updatedSales);
  }

  getSalesList(formParams: any) {
    return this._salesActions.get(formParams);
  }

  getSalesDetails(salesId: string) {
    return this._salesActions.getInfo(salesId);
  }

  deleteSales(salesId: string) {
    return this._salesActions.delete(salesId);
  }

  generateBillNumber() {
    return this._salesActions.generateBillNumber();
  }
}
