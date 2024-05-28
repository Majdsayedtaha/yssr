import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { RegionActions } from '../../actions/settings/region.actions';
import { SkillActions } from '../../actions/settings/skill.actions';


@Injectable({ providedIn: 'root' })
export class SkillService {
  private _actions: SkillActions;

  constructor(private _http: HttpClient) {
    this._actions = new SkillActions(_http);
  }

  skillData(): Observable<IResponse<IEnum[]>> {
    return this._actions.get();
  }

  createSkill(formData: any): Observable<IResponse<IEnum>> {
    return this._actions.add(formData);
  }
}
