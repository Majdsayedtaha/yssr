import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../../interfaces';
import { IResponse } from '../../models';
import { RepresentativeActions } from '../../actions/settings/representative.actions';

@Injectable({ providedIn: 'root' })
export class RepresentativeService {
  private _representativeActions: RepresentativeActions;

  constructor(private _http: HttpClient) {
    this._representativeActions = new RepresentativeActions(_http);
  }

  representatives(): Observable<IResponse<IEnum[]>> {
    return this._representativeActions.representatives();
  }
}
