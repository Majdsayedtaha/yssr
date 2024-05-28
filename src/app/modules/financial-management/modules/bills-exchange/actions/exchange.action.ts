import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IBillExchange, IBillExchangeTable } from '../models/bill-exchange.interface';
import { IEnum } from 'src/app/core/interfaces';

export class ExchangeActions extends CRUDService<IBillExchangeTable, any> {
  constructor(http: HttpClient) {
    super(http, 'Exchange');
  }

  add(formData: IBillExchange): Observable<IResponse<IBillExchangeTable>> {
    return this.createEntity('AddExchangeService', formData, 'true');
  }

  put(id: string, formData: IBillExchange): Observable<IResponse<IBillExchangeTable>> {
    return this.updateEntity('UpdateExchangeService', id, formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IBillExchangeTable, any>>> {
    return this.readPaginationEntities('GetExchangesTable', formData);
  }

  getContractsForExchange(externalOfficeId: string, value?: string, page?: number): Observable<IResponse<any>> {
    return this.readEntities('GetContractsForExchange/' + externalOfficeId, {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  getInfo(id: string): Observable<IResponse<IBillExchangeTable>> {
    return this.readEntity('GetExchangeInfo', id);
  }

  generateNumber(): Observable<IResponse<IBillExchangeTable>> {
    return this.readEntity('GenerateExchangeNumber');
  }

  delete(id: string): Observable<IResponse<IBillExchangeTable>> {
    return this.deleteEntity('Delete', id);
  }
}
