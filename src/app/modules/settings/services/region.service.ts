import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRegion } from '../models';
import { RegionActions } from '../actions/region.action';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private _regionActions: RegionActions;
  constructor(private _http: HttpClient) {
    this._regionActions = new RegionActions(_http);
  }

  getRegions(formData: any) {
    return this._regionActions.get(formData);
  }

  getRegionInfo(id: string) {
    return this._regionActions.getInfo(id);
  }

  addRegion(addRegion: IRegion) {
    return this._regionActions.post(addRegion);
  }

  updateRegion(id: string, formData: IRegion) {
    return this._regionActions.put(id, formData);
  }

  deleteRegion(id: string) {
    return this._regionActions.delete(id);
  }
}
