import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDetail } from '../../interfaces';
import { IResponse } from '../../models';
import { DetailActions } from '../../actions/settings/detail.actions';


@Injectable({ providedIn: 'root' })

export class DetailService {
  private _actions: DetailActions;

  constructor(private _http: HttpClient) {
    this._actions = new DetailActions(_http);
  }

  detailData(): Observable<IResponse<IDetail[]>> {
    return this._actions.get();
  }

  createDetail(formData: any): Observable<IResponse<IDetail>> {
    return this._actions.add(formData);
  }
}
