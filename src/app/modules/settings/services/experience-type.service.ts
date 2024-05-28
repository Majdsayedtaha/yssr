import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IName } from '../models';
import { ExperienceTypeActions } from '../actions/experience-type.action';

@Injectable({ providedIn: 'root' })
export class ExperienceTypeService {
  private _experienceTypeActions: ExperienceTypeActions;

  constructor(private _http: HttpClient) {
    this._experienceTypeActions = new ExperienceTypeActions(_http);
  }
  getExperienceTypes(formData: any) {
    return this._experienceTypeActions.get(formData);
  }

  getExperienceTypeInfo(id: string) {
    return this._experienceTypeActions.getInfo(id);
  }

  addExperienceType(updatedExperienceType: IName) {
    return this._experienceTypeActions.post(updatedExperienceType);
  }

  updateExperienceType(id: string, formData: IName) {
    return this._experienceTypeActions.put(id, formData);
  }

  deleteExperienceType(id: string) {
    return this._experienceTypeActions.delete(id);
  }
}
