import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankActions } from '../actions/bank.action';
import { IBank } from '../models/bank.interface';
@Injectable({ providedIn: 'root' })
export class BankService {
  private _bankActions: BankActions;

  constructor(private _http: HttpClient) {
    this._bankActions = new BankActions(_http);
  }

  addBank(newBank: IBank) {
    return this._bankActions.add(newBank);
  }

  updateBank(bankId: string, updatedBank: IBank) {
    return this._bankActions.put(bankId, updatedBank);
  }
  getBankList(formParams: any) {
    return this._bankActions.get(formParams);
  }

  getBankDetails(bankId: string) {
    return this._bankActions.getInfo(bankId);
  }
  getBanksSelect(formParams: any) {
    return this._bankActions.getBanksSelect(formParams);
  }
  deleteBank(bankId: string) {
    return this._bankActions.delete(bankId);
  }
}
