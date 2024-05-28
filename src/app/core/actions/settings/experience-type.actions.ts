import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../../interfaces';

export class ExperienceTypeActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'ExperienceType');
  }

  get(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetExperienceTypes');
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddExperienceType', formData, 'false');
  }
}
