import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExperienceTypeActions } from '../../actions/settings/experience-type.actions';

@Injectable({ providedIn: 'root' })
export class ExperienceTypeService {

  private _actions: ExperienceTypeActions;

  constructor(private _http: HttpClient) {
    this._actions = new ExperienceTypeActions(_http);
  }

  createExperienceType(formData: any): Observable<any> {
    return this._actions.add(formData);
  }

  experienceTypeData(): Observable<any> {
    return this._actions.get();
  }

}
