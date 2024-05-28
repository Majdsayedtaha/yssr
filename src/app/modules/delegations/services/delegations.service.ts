import { Injectable } from '@angular/core';
import { WorkerService } from '../../worker/services/worker.service';
import { CRUDService } from 'src/app/core/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { IDelegationsRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ElectronicAuthService extends CRUDService<any, any> {
  requestId = new Subject<string | null>();
  constructor(private workerService: WorkerService, private _http: HttpClient) {
    super(_http, 'DelegationRequest');
  }
  fetchRequests(formData: any) {
    return this.readPaginationEntities('GetDelegationRequests', formData);
  }
  fetchRequestDetails(id: string): Observable<IResponse<IDelegationsRequest> | null> {
    return this.readEntity('GetDelegationRequestInfo', id);
  }
  createRequest(formData: any) {
    return this.createEntity('AddDelegationRequest', formData, 'false');
  }
  updateRequest(formData: any, id: string) {
    return this.updateEntity('UpdateDelegationRequest', id, formData);
  }
  deleteWaiverRequest(id: string) {
    return this.deleteEntity('Delete', id);
  }
}
