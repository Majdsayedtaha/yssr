import { CRUDService } from 'src/app/core/services/crud.service';
import { IRent, IRentStatistics } from '../models/rent.interface';
import { HttpClient } from '@angular/common/http';
import { IPagination, IResponse } from 'src/app/core/models';
import { Observable } from 'rxjs';

export class RentActions extends CRUDService<IRent, IRentStatistics> {
  constructor(http: HttpClient) {
    super(http, 'RentRequest');
  }

  get(formData: any): Observable<IResponse<IPagination<IRent, IRentStatistics>>> {
    return this.readPaginationEntities('GetRentRequests', formData);
  }

  getSelect(formDto: any): Observable<IResponse<any[]>> {
    return this.readEntities('GetRentRequestsSelect', formDto);
  }

  getCustomerRentRequestsSelect(customerId?: string, query?: string, page?: number): Observable<IResponse<any[]>> {
    return this.readEntities('GetCustomerRentRequestsSelect/' + customerId, {
      query: query || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  getLastProcedures(id: string): Observable<IResponse<any>> {
    return this.readEntities(`GetLastProcedures/${id}`);
  }

  create(formData: IRent): Observable<IResponse<IRent>> {
    return this.createEntity('AddRentRequest', formData, 'false');
  }

  createProcedure(formData: any): Observable<IResponse<IRent>> {
    return this.createEntity('AddRentRequestProcedure', formData, 'false');
  }

  update(Id: string, formData: any): Observable<IResponse<IRent>> {
    return this.updateEntity('UpdateRentRequest', Id, formData, 'false');
  }

  info(Id: string): Observable<IResponse<IRent>> {
    return this.readEntity('GetRentRequestInfo', Id);
  }

  delete(workerId: string): Observable<IResponse<IRent | IRentStatistics>> {
    return this.deleteEntity('Delete', workerId);
  }

  getWorkersRentList(formData: any): Observable<IResponse<IPagination<IRent, IRentStatistics>>> {
    return this.readPaginationEntities('GetWorkersTable', formData);
  }
}
