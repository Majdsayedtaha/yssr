import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISetting } from '../models';
import { SettingActions } from '../actions/setting.action';

@Injectable({ providedIn: 'root' })
export class SettingService {

  private _actions: SettingActions;

  constructor(private _http: HttpClient) {
    this._actions = new SettingActions(_http);
  }

  getData() {
    return this._actions.get();
  }

  updateData(data: ISetting[]) {
    return this._actions.put(data);
  }
}
