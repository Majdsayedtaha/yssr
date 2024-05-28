import { Injectable } from '@angular/core';
import { CustomerActions } from '../actions/customer.actions';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ICustomerFormData, ICustomerStatistics } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private _customerActions: CustomerActions;
  sideData = new BehaviorSubject<string>('');
  updateStatistics = new BehaviorSubject<ICustomerStatistics | null>(null);

  constructor(private _http: HttpClient) {
    this._customerActions = new CustomerActions(_http);
  }

  getCustomersList(formParams: any) {
    return this._customerActions.get(formParams);
  }

  getCustomerDetails(customerId: string) {
    return this._customerActions.getDetail(customerId);
  }

  getCustomerSelect() {
    return this._customerActions.getSelect();
  }

  getRentCustomersSelect() {
    return this._customerActions.getRentCustomerSelect();
  }

  getCustomersWithContractsSelect() {
    return this._customerActions.getSelectWihContract();
  }

  deleteCustomer(customerId: string) {
    return this._customerActions.delete(customerId);
  }

  checkingCustomerIdentity(formParams: any) {
    return this._customerActions.checkIdentity(formParams);
  }

  addCustomer(newCustomer: ICustomerFormData) {
    return this._customerActions.add(newCustomer);
  }

  updateCustomer(customerId: string, updatedCustomer: ICustomerFormData) {
    return this._customerActions.put(customerId, updatedCustomer);
  }

  blockCustomer(customerId: string) {
    return this._customerActions.blockCustomer(customerId);
  }

  getContractCustomers(filterValue: string) {
    return this._customerActions.getContractCustomersList(filterValue);
  }
}
