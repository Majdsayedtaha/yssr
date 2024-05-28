import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBank } from '../models/bank.interface';

export class BankActions extends CRUDService<IBank, any> {
  constructor(http: HttpClient) {
    super(http, 'Bank');
  }

  add(formData: IBank): Observable<IResponse<IBank>> {
    return this.createEntity('AddBank', formData, 'true');
  }

  put(id: string, formData: IBank): Observable<IResponse<IBank>> {
    return this.updateEntity('UpdateBank', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBank, any>>> {
    return this.readPaginationEntities('GetBanksTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IBank>> {
    return this.readEntity('GetBankInfo', id);
  }
  getBanksSelect(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBank, any>>> {
    return this.readPaginationEntities('GetBanksSelect', formData);
  }
  delete(id: string): Observable<IResponse<IBank>> {
    return this.deleteEntity('Delete', id);
  }
}
