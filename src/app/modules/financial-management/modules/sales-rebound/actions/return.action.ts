import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBillReturnSales, IBillsReturnTableSales } from '../models/bill-rebound.interface';

export class SalesReturnActions extends CRUDService<IBillsReturnTableSales, any> {
  constructor(http: HttpClient) {
    super(http, 'Bill');
  }

  add(formData: IBillReturnSales): Observable<IResponse<IBillsReturnTableSales>> {
    return this.createEntity('AddReturnedBill', formData, 'true');
  }

  put(id: string, formData: IBillReturnSales): Observable<IResponse<IBillsReturnTableSales>> {
    return this.updateEntity('UpdateReturnedBill', id, formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBillsReturnTableSales, any>>> {
    return this.readPaginationEntities('GetReturnedBillsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IBillsReturnTableSales>> {
    return this.readEntity('GetReturnedBillInfo', id);
  }

  getReturnRequestServices(id: string): Observable<IResponse<IBillsReturnTableSales>> {
    return this.readEntity('GetReturnRequestServices', id);
  }

  getMainBillsSelect(formData: {
    [key: string]: string;
  }): Observable<IResponse<IPagination<IBillsReturnTableSales, any>>> {
    return this.readPaginationEntities('GetMainBillsSelect', formData);
  }

  delete(id: string): Observable<IResponse<IBillsReturnTableSales>> {
    return this.deleteEntity('Delete', id);
  }
}
