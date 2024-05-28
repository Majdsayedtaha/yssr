import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../../interfaces';

export class ProcedureActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Procedure');
  }

  get(contractId?: string, query?: string, page?: number): Observable<IResponse<IEnum[]>> {
    let obj: any = {};
    typeof query === 'string' && query !== '' ? (obj['query'] = query) : '';
    typeof page === 'string' && page !== '' ? (obj['page'] = page) : '';
    typeof page === 'number' && page > -1 ? (obj['page'] = page.toString()) : '';

    if (contractId) return this.readEntities('GetRecruitmentProceduresSelect/' + contractId, obj);
    else return this.readEntities('GetRecruitmentProceduresSelect', obj);
  }

  getReturn(contractId?: string): Observable<IResponse<IEnum[]>> {
    if (contractId) return this.readEntities(`GetReturnProceduresSelect/${contractId}`);
    else return this.readEntities('GetReturnProceduresSelect');
  }

  getRent(id?: string): Observable<IResponse<IEnum[]>> {
    if (id) return this.readEntities('GetRentProceduresSelect/' + id);
    return this.readEntities('GetRentProceduresSelect');
  }

  getWaiverRequestsProcedures(id: string) {
    return this.readEntities('GetWaiverProceduresSelect/' + id);
  }
}
