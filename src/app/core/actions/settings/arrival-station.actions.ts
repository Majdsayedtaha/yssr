import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class ArrivalStationActions extends CRUDService<IEnum, IEnum> {
  constructor(http: HttpClient) {
    super(http, 'ArrivalStation');
  }

  getArrivalStations(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetArrivalStationsSelect', {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }
}
