import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from 'src/app/core/interfaces';

export class ExpensesActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'ExpenseType');
  }

  getExpensesTypesSelect(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetExpensesTypesSelect');
  }
}
