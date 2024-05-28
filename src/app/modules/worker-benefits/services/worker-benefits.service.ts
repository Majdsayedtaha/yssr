import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/core/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { IBenefit } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WorkerBenefitsService extends CRUDService<any, any> {
  requestId = new Subject<string | null>();
  constructor(private _http: HttpClient) {
    super(_http, 'WorkerBenefit');
  }
  fetchBenefits(formData: any) {
    return this.readPaginationEntities('GetWorkerBenefitsTable', formData);
  }
  fetchBenefitDetails(id: string): Observable<IResponse<IBenefit> | null> {
    return this.readEntity('GetWorkerBenefitInfo', id);
  }
  createBenefit(formData: any) {
    return this.createEntity('AddWorkerBenefit', formData, 'false');
  }
  updateBenefit(formData: any, id: string) {
    return this.updateEntity('UpdateWorkerBenefit', id, formData);
  }
  deleteBenefit(id: string) {
    return this.deleteEntity('Delete', id);
  }
}
