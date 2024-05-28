import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExchangeActions } from '../actions/exchange.action';
import { ExpensesActions } from '../actions/expenses.action';
@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private _exchangeActions: ExchangeActions;
  private _expensesActions: ExpensesActions;

  constructor(private _http: HttpClient) {
    this._exchangeActions = new ExchangeActions(_http);
    this._expensesActions = new ExpensesActions(_http);
  }

  addExchange(newExchange: any) {
    return this._exchangeActions.add(newExchange);
  }

  updateExchange(exchangeId: string, updatedExchange: any) {
    return this._exchangeActions.put(exchangeId, updatedExchange);
  }

  getExchangeList(formParams: any) {
    return this._exchangeActions.get(formParams);
  }
  getContractsForExchange(externalOfficeId: string,value?: string, page?: number) {
    return this._exchangeActions.getContractsForExchange(externalOfficeId,value, page);
  }

  getExchangeDetails(exchangeId: string) {
    return this._exchangeActions.getInfo(exchangeId);
  }

  getExpensesTypesSelect() {
    return this._expensesActions.getExpensesTypesSelect();
  }

  generateNumber() {
    return this._exchangeActions.generateNumber();
  }

  deleteExchange(exchangeId: string) {
    return this._exchangeActions.delete(exchangeId);
  }
}
