import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IHouseWorkerFormData, IHousingFormData, IHousingStatistics } from '../models';
import { HousingActions } from '../actions/housing.actions';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private _actions: HousingActions;
  private _housingId = new BehaviorSubject<string | null>(null);
  private _statistics = new BehaviorSubject<IHousingStatistics | null>(null);

  constructor(private _http: HttpClient) {
    this._actions = new HousingActions(_http);
  }

  //#region Housing Sidebar Info
  getHousingIdSubject(): Observable<string | null> {
    return this._housingId.asObservable();
  }

  setHousingIdSubject(Id: string | null) {
    this._housingId.next(Id);
  }
  //#endregion

  //#region Statistics
  getStatistics(): Observable<IHousingStatistics | null> {
    return this._statistics.asObservable();
  }

  setStatistics(statistics: IHousingStatistics | null): void {
    this._statistics.next(statistics);
  }
  //#endregion

  //#region End Points
  getHousingsList(formParams: any) {
    return this._actions.get(formParams);
  }

  createHousing(formParams: IHousingFormData) {
    return this._actions.create(formParams);
  }

  addWorkerToHouse(formParams: IHouseWorkerFormData) {
    return this._actions.addHouseWorker(formParams);
  }

  apartmentsData(value?: string, page?: number) {
    return this._actions.getApartments(value, page);
  }

  updateHousing(formParams: IHousingFormData) {
    return this._actions.update(formParams);
  }

  infoHousing(housingId: string) {
    return this._actions.info(housingId);
  }

  deleteHousing(housingId: string) {
    return this._actions.delete(housingId);
  }
  //#endregion
}
