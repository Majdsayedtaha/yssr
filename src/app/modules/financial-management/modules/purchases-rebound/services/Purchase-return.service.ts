import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseReturnActions } from '../actions/purchases-return.action';
import { PurchaseContract } from '../../purchases/models/purchase-contract.interface';
@Injectable({ providedIn: 'root' })
export class PurchaseReturnService {
  private _purchaseReturnActions: PurchaseReturnActions;
  officeContracts: PurchaseContract[] = [];

  constructor(private _http: HttpClient) {
    this._purchaseReturnActions = new PurchaseReturnActions(_http);
  }

  addPurchaseReturn(newPurchaseReturn: any) {
    return this._purchaseReturnActions.add(newPurchaseReturn);
  }

  updatePurchaseReturn(purchaseReturnId: string, updatedPurchaseReturn: any) {
    return this._purchaseReturnActions.put(purchaseReturnId, updatedPurchaseReturn);
  }

  getPurchaseReturnList(formParams: any) {
    return this._purchaseReturnActions.get(formParams);
  }

  getContractsForPurchases(externalOfficeId: string, paginationOptions: any) {
    return this._purchaseReturnActions.getContractsForPurchases(externalOfficeId, paginationOptions);
  }

  getPurchaseReturnDetails(purchaseReturnId: string) {
    return this._purchaseReturnActions.getInfo(purchaseReturnId);
  }

  deletePurchaseReturn(purchaseReturnId: string) {
    return this._purchaseReturnActions.delete(purchaseReturnId);
  }

  generatePurchaseReturnNumber() {
    return this._purchaseReturnActions.generatePurchaseReturnNumber();
  }
}
