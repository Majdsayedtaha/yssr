import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileActions } from '../actions/file.actions';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private _actions: FileActions;

  constructor(private _http: HttpClient) {
    this._actions = new FileActions(_http);
  }

  exportFile(formDto: any) {
    return this._actions.get(formDto);
  }

  exportCustomerContractFile(customerId: string) {
    return this._actions.sanadCustomer(customerId);
  }

  exportWorkerContractFile(contractId: string) {
    return this._actions.receivingWorker(contractId);
  }
}
