import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../../interfaces';

export class JobActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Job');
  }

  get(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetJobs', { query: value || '', page: typeof page == 'number' ? page.toString() : '' });
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddJob', formData, 'false');
  }
}
