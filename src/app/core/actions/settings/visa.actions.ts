import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class VisaActions extends CRUDService<IEnum, IEnum> {
  constructor(http: HttpClient) {
    super(http, 'VisaType');
  }

  getVisaTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetVisaTypes');
  }
}
