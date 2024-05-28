import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LinkResumeWaiverActions } from '../actions/link-resume-waiver';
import { IWaiver } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LinkResumeWaiverService {
  private _linkResumeWaiverActions: LinkResumeWaiverActions;
  sideLinkResume = new BehaviorSubject<string>('');
  linkedSuccessfully = new BehaviorSubject<IWaiver | null>(null);

  constructor(_http: HttpClient) {
    this._linkResumeWaiverActions = new LinkResumeWaiverActions(_http);
  }

  getWorkersForExternalWaiver(requestId: string, page: number = 0) {
    return this._linkResumeWaiverActions.getWorkersForExternalWaiver(requestId, page);
  }

  getSuggestedWorkersForExternalWaiver(requestId: string, page: number = 0) {
    return this._linkResumeWaiverActions.getSuggestedWorkersForExternalWaiver(requestId, page);
  }
}
