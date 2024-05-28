import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IDevice } from '../models/device.interface';

export class DeviceActions extends CRUDService<IDevice, any> {
  constructor(http: HttpClient) {
    super(http, 'Device');
  }

  add(formData: IDevice): Observable<IResponse<IDevice>> {
    return this.createEntity('AddDevice', formData, 'true');
  }

  put(id: string, formData: IDevice): Observable<IResponse<IDevice>> {
    return this.updateEntity('UpdateDevice', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IDevice, any>>> {
    return this.readPaginationEntities('GetDevicesTable', formData);
  }
  getDevicesSelect(formData: { [key: string]: string }): Observable<IResponse<IPagination<IDevice, any>>> {
    return this.readPaginationEntities('GetDevicesSelect', formData);
  }
  delete(id: string): Observable<IResponse<IDevice>> {
    return this.deleteEntity('Delete', id);
  }
}
