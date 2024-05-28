import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class RepresentativeActions extends CRUDService<IEnum, IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Representative');
  }

  representatives(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetRepresentativesSelect');
  }
}
