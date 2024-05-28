import { Injectable } from '@angular/core';
import { IWaiverRequest } from '../models';
import { Observable, Subject, map } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { WaiverActions } from '../actions/waiver.actions';
import { WorkerService } from '../../worker/services/worker.service';

@Injectable({
  providedIn: 'root',
})
export class WaiverService {
  waiverRequestId = new Subject<string | null>();
  private _waiverActions!: WaiverActions;

  constructor(private _http: HttpClient, private workerService: WorkerService) {
    this._waiverActions = new WaiverActions(_http);
  }

  fetchWaiverRequests(formData: any) {
    return this._waiverActions.getRequests(formData);
  }

  fetchCustomerWorkers(id: string) {
    return this.workerService.getWorkersForCustomer(id);
  }

  fetchWaiverRequestDetails(id: string): Observable<IResponse<IWaiverRequest> | null> {
    return this._waiverActions.getInfo(id);
  }

  fetchWorkers() {
    return this.workerService.getWorkersList({}).pipe(
      map(res => {
        return { data: res.data.list };
      })
    );
  }

  fetchLastProcedureByRequestId(requestId: string) {
    return this._waiverActions.getLastProcedures(requestId);
  }

  createWaiverRequest(formData: any) {
    return this._waiverActions.create(formData);
  }

  updateWaiverRequest(formData: any, id: string) {
    return this._waiverActions.update(id, formData);
  }

  deleteWaiverRequest(id: string) {
    return this._waiverActions.delete(id);
  }

  getRequestTotalTax(id: string, formData: any) {
    return this._waiverActions.calculateTax(id, formData);
  }

  createWaiverProcedure(formData: any): Observable<IResponse<any>> {
    return this._waiverActions.createWaiverProcedure(formData);
  }

  getWaiverRequestsSelect(value?: string, page?: number) {
    return this._waiverActions.getWaiverRequestsSelect(value, page);
  }
}
