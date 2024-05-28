import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IName } from '../models';
import { SkillActions } from '../actions/skill.action';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private _skillActions: SkillActions;

  constructor(private _http: HttpClient) {
    this._skillActions = new SkillActions(_http);
  }

  getSkills(formData: any) {
    return this._skillActions.get(formData);
  }

  getSkillInfo(id: string) {
    return this._skillActions.getInfo(id);
  }

  addSkill(addSkill: IName) {
    return this._skillActions.post(addSkill);
  }

  updateSkill(id: string, formData: IName) {
    return this._skillActions.put(id, formData);
  }

  deleteSkill(id: string) {
    return this._skillActions.delete(id);
  }
}
