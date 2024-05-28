import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IWorker, IWorkerStatistics } from '../models';
import { IEnum } from 'src/app/core/interfaces';

export class WorkerActions extends CRUDService<IWorker, IWorkerStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Worker');
  }

  get(formData: any): Observable<IResponse<IPagination<IWorker, IWorkerStatistics>>> {
    return this.readPaginationEntities('GetWorkers', formData);
  }

  getSelect(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetWorkersSelect');
  }

  getWorkersForCustomer(id: string) {
    return this.readPaginationEntities(`GetWorkersByCustomerId/${id}`, {});
  }

  create(formData: FormData): Observable<IResponse<IWorker>> {
    return this.createEntity('AddWorker', formData, 'false');
  }

  update(Id: string, formData: FormData): Observable<IResponse<IWorker>> {
    return this.updateEntity('UpdateWorker', Id, formData, 'false');
  }

  blockUnBlock(Id: string): Observable<IResponse<any>> {
    return this.updateEntity('BlockUnblockWorker', Id);
  }

  info(Id: string): Observable<IResponse<any>> {
    return this.readEntity('GetWorkerInfo', Id);
  }

  delete(workerId: string): Observable<IResponse<IWorker | IWorkerStatistics>> {
    return this.deleteEntity('DeleteWorker', workerId);
  }
}
