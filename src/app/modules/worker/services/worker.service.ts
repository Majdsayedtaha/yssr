import { Injectable } from '@angular/core';
import { WorkerActions } from '../actions/worker.actions';
import { HttpClient } from '@angular/common/http';
import { IWorkerFormData, IWorkerStatistics } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { IEnum } from 'src/app/core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private _workerId = new BehaviorSubject<string | null>(null);
  private _workerActions: WorkerActions;
  private _statistics = new BehaviorSubject<IWorkerStatistics | null>(null);

  constructor(private _http: HttpClient) {
    this._workerActions = new WorkerActions(_http);
  }

  getWorkerIdSubject(): Observable<string | null> {
    return this._workerId.asObservable();
  }

  getWorkersSelect(): Observable<IResponse<IEnum[]>> {
    return this._workerActions.getSelect();
  }

  setWorkerIdSubject(Id: string | null) {
    this._workerId.next(Id);
  }

  getStatistics(): Observable<IWorkerStatistics | null> {
    return this._statistics.asObservable();
  }

  setStatistics(statistics: any): void {
    this._statistics.next(statistics);
  }

  getWorkersList(formParams: any) {
    return this._workerActions.get(formParams);
  }
  getWorkersForCustomer(id: string) {
    return this._workerActions.getWorkersForCustomer(id);
  }

  createWorker(formParams: FormData) {
    return this._workerActions.create(formParams);
  }

  updateWorker(workerId: string, formParams: FormData) {
    return this._workerActions.update(workerId, formParams);
  }

  infoWorker(workerId: string) {
    return this._workerActions.info(workerId);
  }

  toggleWorkerBlock(workerId: string) {
    return this._workerActions.blockUnBlock(workerId);
  }

  deleteWorker(Id: string) {
    return this._workerActions.delete(Id);
  }
}
