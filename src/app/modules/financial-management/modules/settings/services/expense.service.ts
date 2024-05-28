import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseActions } from '../actions/expense.action';
import { IExpense } from '../models/expense.interface';
@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private _ExpenseActions: ExpenseActions;

  constructor(private _http: HttpClient) {
    this._ExpenseActions = new ExpenseActions(_http);
  }

  addExpense(newExpense: IExpense) {
    return this._ExpenseActions.add(newExpense);
  }

  updateExpense(expenseId: string, updatedExpense: IExpense) {
    return this._ExpenseActions.put(expenseId, updatedExpense);
  }
  getExpenseList(formParams: any) {
    return this._ExpenseActions.get(formParams);
  }

  getExpensesSelect(formParams: any) {
    return this._ExpenseActions.getExpensesSelect(formParams);
  }
  deleteExpense(expenseId: string) {
    return this._ExpenseActions.delete(expenseId);
  }
}
