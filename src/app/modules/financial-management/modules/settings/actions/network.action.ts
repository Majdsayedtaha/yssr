import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { INetwork } from '../models/network.interface';

export class NetworkActions extends CRUDService<INetwork, any> {
  constructor(http: HttpClient) {
    super(http, 'Network');
  }

  add(formData: INetwork): Observable<IResponse<INetwork>> {
    return this.createEntity('AddNetwork', formData, 'true');
  }

  put(id: string, formData: INetwork): Observable<IResponse<INetwork>> {
    return this.updateEntity('UpdateNetwork', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<INetwork, any>>> {
    return this.readPaginationEntities('GetNetworksTable', formData);
  }

  getNetworksSelect(formData: { [key: string]: string }): Observable<IResponse<IPagination<INetwork, any>>> {
    return this.readPaginationEntities('GetNetworksSelect', formData);
  }
  delete(id: string): Observable<IResponse<INetwork>> {
    return this.deleteEntity('Delete', id);
  }
}
