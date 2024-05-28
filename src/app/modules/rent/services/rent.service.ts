import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RentActions } from '../actions/rent.actions';
import { IRent, IRentStatistics } from '../models/rent.interface';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class RentService {
  private _actions: RentActions;
  private _rentId = new BehaviorSubject<string | null>(null);
  private _financialSidebar = new BehaviorSubject<string | null>(null);
  private _procedureSidebar = new BehaviorSubject<string | null>(null);
  private _logProcedureSidebar = new BehaviorSubject<any | null>(null);
  private _editProcedureSidebar = new BehaviorSubject<any | null>(null);
  private _statistics = new BehaviorSubject<IRentStatistics | null>(null);
  sidenavAddProcedure = new BehaviorSubject<MatSidenav | null>(null);

  constructor(private _http: HttpClient) {
    this._actions = new RentActions(_http);
  }

  //#region Edit Procedures Sidebar
  getSelectedProcedureSubject(): Observable<any | null> {
    return this._editProcedureSidebar.asObservable();
  }

  setSelectedProcedureSubject(data: any | null) {
    this._editProcedureSidebar.next(data);
  }
  //#endregion

  //#region Log Procedures
  getLogProcedureIdSubject(): Observable<any | null> {
    return this._logProcedureSidebar.asObservable();
  }

  setLogProcedureIdSubject(data: any | null) {
    this._logProcedureSidebar.next(data);
  }
  //#endregion

  //#region Rent Sidebar Info
  getRentIdSubject(): Observable<string | null> {
    return this._rentId.asObservable();
  }

  setRentIdSubject(Id: string | null) {
    this._rentId.next(Id);
  }
  //#endregion

  //#region Rent Sidebar Financial
  getFinancialSidebar(): Observable<string | null> {
    return this._financialSidebar.asObservable();
  }

  setFinancialSidebar(Id: string | null) {
    return this._financialSidebar.next(Id);
  }
  //#endregion

  //#region Statistics
  getStatistics(): Observable<IRentStatistics | null> {
    return this._statistics.asObservable();
  }

  setStatistics(statistics: IRentStatistics | null): void {
    this._statistics.next(statistics);
  }
  //#endregion

  //#region End Points
  getRentsList(formParams: any) {
    return this._actions.get(formParams);
  }

  getWorkersRentList(formParams: any) {
    return this._actions.getWorkersRentList(formParams);
  }

  getRentsSelect(formParams: any = undefined) {
    return this._actions.getSelect(formParams);
  }

  getCustomerRentRequestsSelect(customerId?: string, query?: string, page?: number) {
    return this._actions.getCustomerRentRequestsSelect(customerId, query, page);
  }

  createRent(formParams: IRent) {
    return this._actions.create(formParams);
  }

  createRentProcedure(formParams: any) {
    return this._actions.createProcedure(formParams);
  }

  updateRent(RentId: string, formParams: any) {
    return this._actions.update(RentId, formParams);
  }

  infoRent(RentId: string) {
    return this._actions.info(RentId);
  }

  lastProcedures(RentId: string) {
    return this._actions.getLastProcedures(RentId);
  }

  deleteRent(Id: string) {
    return this._actions.delete(Id);
  }
  //#endregion
}
