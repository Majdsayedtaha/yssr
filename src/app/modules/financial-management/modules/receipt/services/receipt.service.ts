import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReceiptActions } from '../actions/receipt.action';
@Injectable({ providedIn: 'root' })
export class ReceiptService {
  private _receiptActions: ReceiptActions;

  constructor(private _http: HttpClient) {
    this._receiptActions = new ReceiptActions(_http);
  }

  addReceipt(newReceipt: any) {
    return this._receiptActions.add(newReceipt);
  }

  updateReceipt(receiptId: string, updatedReceipt: any) {
    return this._receiptActions.put(receiptId, updatedReceipt);
  }
  getReceiptList(formParams: any) {
    return this._receiptActions.get(formParams);
  }

  getReceiptDetails(receiptId: string) {
    return this._receiptActions.getInfo(receiptId);
  }
  getCustomerBills(customerId: string) {
    return this._receiptActions.getCustomerBills(customerId);
  }
  getBillServices(billId: string) {
    return this._receiptActions.getBillServices(billId);
  }
  generateReceiptNumber() {
    return this._receiptActions.generateReceiptNumber();
  }
  deleteReceipt(receiptId: string) {
    return this._receiptActions.delete(receiptId);
  }

  fetchCustomerBills(customerId: number) {
    return this._receiptActions.fetchCustomerBills(customerId);
  }
}
