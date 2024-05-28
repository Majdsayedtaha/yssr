import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ContractProcedureActions } from '../actions/contract-procedure.action';
import { IContractProcedure } from '../models';
import { ContractProceduresActions } from '../actions/contract-procedures.action';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class ContractProcedureService {
  private _contractProcedureActions: ContractProcedureActions;
  private _contractProceduresActions: ContractProceduresActions;

  sideAddProcedure = new BehaviorSubject<any | null>(null);
  sideContractProcedures = new BehaviorSubject<IContractProcedure | null>(null);
  sidenavAddProcedure = new BehaviorSubject<MatSidenav | null>(null);

  constructor(private _http: HttpClient) {
    this._contractProcedureActions = new ContractProcedureActions(_http);
    this._contractProceduresActions = new ContractProceduresActions(_http);
  }

  linkProcedureWithContract(formData: any) {
    return this._contractProcedureActions.linkProcedureWithContract(formData);
  }

  getProcedureToContractDetail(contractId: string) {
    return this._contractProceduresActions.getProceduresToContractDetail(contractId);
  }

  getReturnWorkerDetails(customerId: string, date?: string, workerId?: string) {
    return this._contractProcedureActions.getReturnWorkerDetails(customerId, date, workerId);
  }
}
