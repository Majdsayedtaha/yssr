import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDetail } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class DetailActions extends CRUDService<IDetail> {
  constructor(http: HttpClient) {
    super(http, 'Detail');
  }

  get(): Observable<IResponse<IDetail[]>> {
    return this.readEntities('GetDetails');
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddDetail', formData, 'false');
  }
}
