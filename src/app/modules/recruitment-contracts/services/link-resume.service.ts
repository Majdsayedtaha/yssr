import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LinkResumeActions } from '../actions/link-resume.action';
import { BehaviorSubject } from 'rxjs';
import { IContractFormData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LinkResumeService {
  private _linkResumeActions: LinkResumeActions;
  sideLinkResume = new BehaviorSubject<string>('');
  linkedSuccessfully = new BehaviorSubject<IContractFormData | null>(null);

  constructor(_http: HttpClient) {
    this._linkResumeActions = new LinkResumeActions(_http);
  }

  getWorkersRecruitmentContract(contractId: string, page: number = 0) {
    return this._linkResumeActions.getWorkersRecruitmentContract(contractId, page);
  }

  getSuggestedWorkersForRecruitmentContract(contractId: string, page: number = 0) {
    return this._linkResumeActions.getSuggestedWorkersForRecruitmentContract(contractId, page);
  }
}
