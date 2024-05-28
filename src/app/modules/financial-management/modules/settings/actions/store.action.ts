import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IStorage } from '../models/storage.interface';

export class StoreActions extends CRUDService<IStorage, any> {
  constructor(http: HttpClient) {
    super(http, 'Store');
  }

  add(formData: IStorage): Observable<IResponse<IStorage>> {
    return this.createEntity('AddStore', formData, 'true');
  }
  put(id: string, formData: IStorage): Observable<IResponse<IStorage>> {
    return this.updateEntity('UpdateStore', id, formData, 'false');
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IStorage, any>>> {
    return this.readPaginationEntities('GetStoresTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IStorage>> {
    return this.readEntity('GetStoreInfo', id);
  }
  getStoreSelect(formData: { [key: string]: string }): Observable<IResponse<IPagination<IStorage, any>>> {
    return this.readPaginationEntities('GetStoreSelect', formData);
  }
  delete(id: string): Observable<IResponse<IStorage>> {
    return this.deleteEntity('Delete', id);
  }
}
