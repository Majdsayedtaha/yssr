import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRecruitmentProcedure } from '../models';
import { RecruitmentProceduresActions } from '../actions/recruitment-procedure-action';

@Injectable({ providedIn: 'root' })
export class RecruitmentProceduresService {
  private _RecruitmentProceduresActions: RecruitmentProceduresActions;

  constructor(private _http: HttpClient) {
    this._RecruitmentProceduresActions = new RecruitmentProceduresActions(_http);
  }

  getRecruitmentProcedures(formData: any) {
    return this._RecruitmentProceduresActions.get(formData);
  }

  addRecruitmentProcedures(addRecruitmentProcedures: IRecruitmentProcedure) {
    return this._RecruitmentProceduresActions.post(addRecruitmentProcedures);
  }

  updateRecruitmentProcedures(id: string, formData: IRecruitmentProcedure) {
    return this._RecruitmentProceduresActions.put(id, formData);
  }

  deleteRecruitmentProcedure(id: string) {
    return this._RecruitmentProceduresActions.delete(id);
  }
}
