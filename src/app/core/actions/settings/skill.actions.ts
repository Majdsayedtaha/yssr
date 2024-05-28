import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { CRUDService } from '../../services/crud.service';

export class SkillActions extends CRUDService<IEnum, IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Skill');
  }

  get(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetSkills');
  }

  add(formData: any): Observable<any> {
    return this.createEntity('AddSkill', formData, 'false');
  }
}
