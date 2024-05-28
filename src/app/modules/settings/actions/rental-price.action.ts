import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IRentPrice } from '../models';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';

export class RentPriceActions extends CRUDService<IRentPrice, {}> {
  constructor(http: HttpClient) {
    super(http, 'RentSalePrice');
  }

  getCountryRentPrices(id: string): Observable<IResponse<IRentPrice>> {
    return this.readEntity('GetCountryRentSalePrices', id);
  }

  getCountryWithJobRentSalePrices(query: any): Observable<any> {
    return this.readEntities('GetCountryWithJobRentSalePrices', query);
  }

  AddCountryRentPrices(formData: IRentPrice) {
    return this.createEntity('AddCountryRentSalePrice', formData, 'false');
  }

  deleteRentPrices(id: string) {
    return this.deleteEntity('Delete', id);
  }

  updateRentPrice(id: string, formData: any) {
    return this.updateEntity('UpdateRentSalePrice', id, formData, 'false');
  }
}
