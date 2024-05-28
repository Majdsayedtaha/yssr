import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcedureActions } from '../../actions/settings/procedure.actions';
import { IResponse } from '../../models';
import { IEnum } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class ProceduresService {
  private _actions: ProcedureActions;

  constructor(private _http: HttpClient) {
    this._actions = new ProcedureActions(_http);
  }

  getAllProceduresSelect(contractId?: string, query?: string, page?: number): Observable<any> {
    return this._actions.get(contractId, query, page);
  }

  getAllProceduresReturnSelect(contractId?: string): Observable<any> {
    return this._actions.getReturn(contractId);
  }

  getAllProceduresRentSelect(id?:string): Observable<any> {
    return this._actions.getRent(id);
  }

  getWaiverRequestsProcedures(id:string): Observable<IResponse<IEnum[]>> {
    return this._actions.getWaiverRequestsProcedures(id);
  }
}
