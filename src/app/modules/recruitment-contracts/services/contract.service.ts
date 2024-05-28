import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IContractFormData, IContractWarrantyStatistics } from '../models';
import { ContractActions } from '../actions/contract.actions';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private _contractActions: ContractActions;
  public _optionContractEnding: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sideData = new BehaviorSubject<string>('');
  sideContractDetails = new BehaviorSubject<IContractFormData | null>(null);
  updateStatistics = new BehaviorSubject<IContractWarrantyStatistics | IContractFormData | null | any>(null);
  rowUpdater = new BehaviorSubject<any>(null);

  constructor(_http: HttpClient) {
    this._contractActions = new ContractActions(_http);
  }

  getContractsList(formParams: any) {
    return this._contractActions.get(formParams);
  }

  finishWarranty(contractId: string) {
    return this._contractActions.finishWarranty(contractId);
  }

  extendWarranty(formDto: any, contractId: string) {
    return this._contractActions.extendWarranty(formDto, contractId);
  }

  getContractsWarrantyList(formParams: any) {
    return this._contractActions.getWarranty(formParams);
  }

  getContractDetails(contractId: string) {
    return this._contractActions.getDetail(contractId);
  }

  deleteContract(contractId: string) {
    return this._contractActions.delete(contractId);
  }

  addContract(newContract: IContractFormData) {
    return this._contractActions.add(newContract);
  }

  updateContract(contractId: string, updatedContract: IContractFormData) {
    return this._contractActions.put(contractId, updatedContract);
  }

  putLinkContract(linkContract: { workerId: string; contractId: string }) {
    return this._contractActions.putLinkContract(linkContract);
  }

  getCustomerOrContract(type: string, customerOrContractId: string) {
    return this._contractActions.getCustomerOrContract(type, customerOrContractId);
  }
}
