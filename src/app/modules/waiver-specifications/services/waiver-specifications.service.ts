import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { HttpClient } from '@angular/common/http';
import { IWaiverSpecificationRequest } from '../models';
import { WaiverSpecificationAction } from '../actions/waiver-specification.actions';

@Injectable({
  providedIn: 'root',
})
export class WaiverSpecificationService {

  requestId = new Subject<string | null>();
  private _waiverSpecificationAction!: WaiverSpecificationAction;

  constructor(private _http: HttpClient) {
    this._waiverSpecificationAction = new WaiverSpecificationAction(_http);
  }

  fetchWaiverSpecificationsRequests(formData: any) {
    return this._waiverSpecificationAction.get(formData);
  }

  fetchWaiverSpecificationDetails(id: string): Observable<IResponse<IWaiverSpecificationRequest> | null> {
    return this._waiverSpecificationAction.getInfo(id);
  }

  createRequest(formData: any) {
    return this._waiverSpecificationAction.create(formData);
  }

  updateRequest(formData: any, id: string) {
    return this._waiverSpecificationAction.update(id, formData);
  }

  deleteWaiverRequest(id: string) {
    return this._waiverSpecificationAction.delete(id);
  }

  putLinkRequest(linkRequest: { workerId: string; id: string }) {
    return this._waiverSpecificationAction.putLinkExternal(linkRequest);
  }
}
