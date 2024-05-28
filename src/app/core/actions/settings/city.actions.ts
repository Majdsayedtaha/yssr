import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class CityActions extends CRUDService<IEnum, IEnum> {
  constructor(http: HttpClient) {
    super(http, 'City');
  }

  getRegionCities(id: string, value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetRegionCities/' + id, {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }
}
