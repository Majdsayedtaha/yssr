import { Observable } from 'rxjs';
import { ISetting } from '../models';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';

export class SettingActions extends CRUDService<ISetting, {}> {
  constructor(http: HttpClient) {
    super(http, 'Settings');
  }

  get(): Observable<IResponse<ISetting[]>> {
    return this.readEntities('GetEmailAndSMSSettings', undefined);
  }

  put(formData: any): Observable<IResponse<ISetting>> {
    return this.updateEntity('UpdateSettingsList', undefined, formData, 'false');
  }

}
