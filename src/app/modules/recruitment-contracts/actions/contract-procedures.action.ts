import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IContractProcedure } from '../models';

export class ContractProceduresActions extends CRUDService<IContractProcedure[]> {
  constructor(http: HttpClient) {
    super(http, 'RecruitmentContract');
  }

  getProceduresToContractDetail(id: string): Observable<IResponse<IContractProcedure[]>> {
    return this.readEntity('GetContractLastProcedures', id);
  }
}
