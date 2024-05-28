import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IContractStatistics, IContractProcedure } from '../models';

export class ContractProcedureActions extends CRUDService<IContractProcedure, IContractStatistics> {
  constructor(http: HttpClient) {
    super(http, 'RecruitmentContract');
  }

  linkProcedureWithContract(formData: IContractProcedure): Observable<IResponse<IContractProcedure>> {
    return this.updateEntity('LinkProcedureToContract', '', formData, 'false');
  }

  getReturnWorkerDetails(id: string, date?: string, workerId?: string) {
    return this.readEntity(`GetContractDetailsForReturnRequest/${id}?date=${date}&workerId=${workerId}`);
  }
}
