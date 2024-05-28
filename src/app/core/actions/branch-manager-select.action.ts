import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CRUDService } from '../services/crud.service';
import { IPagination, IResponse } from '../models';
import { IEnum } from '../interfaces';

export class BranchManagerSelectAction extends CRUDService<IEnum,{}> {
  constructor(http: HttpClient) {
    super(http, 'Branch');
  }

  getBranchesManagersSelect():  Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetBranchesManagersSelect');
  }
}
