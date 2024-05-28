import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBillSales } from '../models/bill.interface';

export class SalesActions extends CRUDService<IBillSales, any> {
  constructor(http: HttpClient) {
    super(http, 'Bill');
  }

  add(formData: IBillSales): Observable<IResponse<IBillSales>> {
    return this.createEntity('AddBill', formData, 'true');
  }

  put(id: string, formData: IBillSales): Observable<IResponse<IBillSales>> {
    return this.updateEntity('UpdateBill', id, formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBillSales, any>>> {
    return this.readPaginationEntities('GetBillsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IBillSales>> {
    return this.readEntity('GetBillInfo', id);
  }

  delete(id: string): Observable<IResponse<IBillSales>> {
    return this.deleteEntity('Delete', id);
  }

  generateBillNumber() {
    return this.readEntity('GenerateBillNumber');
  }
}
