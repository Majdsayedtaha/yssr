import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBillReceipt, IBillReceiptTable } from '../models/bill-receipt.interface';

export class ReceiptActions extends CRUDService<IBillReceiptTable, any> {
  constructor(http: HttpClient) {
    super(http, 'Receipt');
  }
  add(formData: IBillReceiptTable): Observable<IResponse<IBillReceiptTable>> {
    return this.createEntity('AddReceipt', formData, 'true');
  }
  put(id: string, formData: IBillReceiptTable): Observable<IResponse<IBillReceiptTable>> {
    return this.updateEntity('UpdateReceipt', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBillReceiptTable, any>>> {
    return this.readPaginationEntities('GetReceiptsTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IBillReceiptTable>> {
    return this.readEntity('GetReceiptInfo', id);
  }
  generateReceiptNumber(): Observable<IResponse<IBillReceiptTable>> {
    return this.readEntity('GenerateReceiptNumber');
  }
  getCustomerBills(customerId: string): Observable<IResponse<IBillReceiptTable>> {
    return this.updateEntity('GetCustomerBills', customerId);
  }
  getBillServices(billId: string): Observable<IResponse<IBillReceiptTable>> {
    return this.updateEntity('GetBillServices', billId);
  }
  delete(id: string): Observable<IResponse<IBillReceiptTable>> {
    return this.deleteEntity('Delete', id);
  }
  fetchCustomerBills(customerId: number) {
    return this.readEntity('GetCustomerBills', customerId);
  }
}
