import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IArrivalAirport } from '../models';

export class ArrivalAirportActions extends CRUDService<IArrivalAirport, {}> {
  constructor(http: HttpClient) {
    super(http, 'ArrivalStation');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IArrivalAirport, {}>>> {
    return this.readPaginationEntities('GetArrivalStationsTable', formData);
  }

  getInfo(id: string): Observable<IResponse<IArrivalAirport>> {
    return this.readEntity('GetArrivalStationInfo', id);
  }

  post(formData: any): Observable<IResponse<IArrivalAirport>> {
    return this.createEntity('AddArrivalStation', formData, 'false');
  }

  put(id: string, formData: IArrivalAirport): Observable<IResponse<IArrivalAirport>> {
    return this.updateEntity('UpdateArrivalStation', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IArrivalAirport>> {
    return this.deleteEntity('Delete', id);
  }
}
