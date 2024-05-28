import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IExpense } from '../models/expense.interface';

export class ExpenseActions extends CRUDService<IExpense, any> {
  constructor(http: HttpClient) {
    super(http, 'ExpenseType');
  }

  add(formData: IExpense): Observable<IResponse<IExpense>> {
    return this.createEntity('AddExpenseType', formData, 'true');
  }

  put(id: string, formData: IExpense): Observable<IResponse<IExpense>> {
    return this.updateEntity('UpdateExpenseType', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IExpense, any>>> {
    return this.readPaginationEntities('GetExpenseTypesTable', formData);
  }
  getExpensesSelect(formData: { [key: string]: string }): Observable<IResponse<IPagination<IExpense, any>>> {
    return this.readPaginationEntities('GetExpensesTypesSelect', formData);
  }
  delete(id: string): Observable<IResponse<IExpense>> {
    return this.deleteEntity('Delete', id);
  }
}
