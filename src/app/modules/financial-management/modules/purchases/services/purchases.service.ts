import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseActions } from '../actions/purchases.action';
import { PurchaseContract } from '../models/purchase-contract.interface';
@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private _purchaseActions: PurchaseActions;
  public officeContracts: PurchaseContract[] = [];

  constructor(private _http: HttpClient) {
    this._purchaseActions = new PurchaseActions(_http);
  }

  addPurchase(newPurchase: any) {
    return this._purchaseActions.add(newPurchase);
  }

  updatePurchase(purchaseId: string, updatedPurchase: any) {
    return this._purchaseActions.put(purchaseId, updatedPurchase);
  }

  getPurchaseList(formParams: any) {
    return this._purchaseActions.get(formParams);
  }

  getPurchaseDetails(purchaseId: string) {
    return this._purchaseActions.getInfo(purchaseId);
  }

  deletePurchase(purchaseId: string) {
    return this._purchaseActions.delete(purchaseId);
  }

  generatePurchaseNumber() {
    return this._purchaseActions.generatePurchaseNumber();
  }
}
