import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IMovementTransactionTable, IMovementTransaction } from '../models/movement.interface';


export class MovementTransactionActions extends CRUDService<IMovementTransactionTable, any> {
  constructor(http: HttpClient) {
    super(http, 'FinancialTransaction');
  }

  add(formData: IMovementTransaction): Observable<IResponse<IMovementTransactionTable>> {
    return this.createEntity('AddTransaction', formData, 'true');
  }

  put(id: string, formData: IMovementTransaction): Observable<IResponse<IMovementTransactionTable>> {
    return this.updateEntity(`UpdateTransaction?id=${id}`,'', formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IMovementTransactionTable, any>>> {
    return this.readPaginationEntities('GetTransactionsTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IMovementTransaction>> {
    return this.readEntity('GetTransactionInfo', id);
  }
  delete(id: string): Observable<IResponse<IMovementTransactionTable>> {
    return this.deleteEntity('Delete', id);
  }
}
