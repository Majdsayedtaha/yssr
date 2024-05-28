import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../../interfaces';

export class CountryActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Country');
  }

  get(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCountries', {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddCountry', formData, 'false');
  }
}
