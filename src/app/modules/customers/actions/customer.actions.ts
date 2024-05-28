import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ICustomer, ICustomerFormData, ICustomerStatistics } from '../models/customer.interface';
import { IEnum } from 'src/app/core/interfaces';
import { IRent } from '../../rent/models/rent.interface';

export class CustomerActions extends CRUDService<ICustomer, ICustomerStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Customer');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<ICustomer, ICustomerStatistics>>> {
    return this.readPaginationEntities('GetCustomers', formData);
  }

  getDetail(customerId: string): Observable<IResponse<ICustomer>> {
    return this.readEntity('GetCustomerDetails', customerId);
  }

  getSelect(): Observable<IResponse<IEnum[] | ICustomer[]>> {
    return this.readEntities('GetCustomersSelect');
  }

  getRentCustomerSelect(): Observable<IResponse<IEnum[] | ICustomer[]>> {
    return this.readEntities('GetCustomersWithRentSelect');
  }

  getSelectWihContract(): Observable<IResponse<IEnum[] | ICustomer[]>> {
    return this.readEntities('GetCustomersWithContractsSelect');
  }

  delete(customerId: string): Observable<IResponse<ICustomer | ICustomerStatistics>> {
    return this.deleteEntity('DeleteCustomer', customerId);
  }

  checkIdentity(formData: ICustomerFormData): Observable<any> {
    return this.createEntity('CheckIdentity', formData, 'false');
  }

  add(formData: ICustomerFormData): Observable<IResponse<ICustomer>> {
    return this.createEntity('AddCustomer', formData, 'true');
  }

  put(id: string, formData: ICustomerFormData): Observable<IResponse<ICustomer>> {
    return this.updateEntity('UpdateCustomer', id, formData, 'false');
  }

  blockCustomer(id: string): Observable<IResponse<ICustomer>> {
    return this.updateEntity('BlockUnBlockCustomer', id);
  }

  getContractCustomersList(query: string) {
    return this.readEntities('GetCustomersForContract', { query });
  }
}
