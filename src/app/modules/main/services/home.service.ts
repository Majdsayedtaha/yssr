import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeActions } from '../actions/home.action';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private _homeActions: HomeActions;
  public dashboardFilter$ = new Subject<{ idDepartment: string; date: any }>();

  constructor(_http: HttpClient) {
    this._homeActions = new HomeActions(_http);
  }

  //Recruitment
  getRecruitmentTotalCount() {
    return this._homeActions.getRecruitmentTotalCount();
  }

  getAboutToEndWarrantyContracts() {
    return this._homeActions.getAboutToEndWarrantyContracts();
  }

  getContractsCountPerYear() {
    return this._homeActions.getContractsCountPerYear();
  }

  getCountriesContractsCount() {
    return this._homeActions.getCountriesContractsCount();
  }

  getLasProceduresCount() {
    return this._homeActions.getLasProceduresCount();
  }

  getAboutToEndRecruitmentContracts() {
    return this._homeActions.getAboutToEndRecruitmentContracts();
  }

  getAllRecruitment(date?: any) {
    return this._homeActions.getAllRecruitment(date);
  }
  getContractList(formParams: any) {
    return this._homeActions.get(formParams);
  }

  //Worker
  getAllWorker(date?: any) {
    return this._homeActions.getAllWorker(date);
  }
  getTotalWorker(date?: any) {
    return this._homeActions.getTotalWorker(date);
  }

  //Customer
  getCustomerStatistics(date?: any) {
    return this._homeActions.getCustomerStatistics(date);
  }

  //Refund
  getRefundStatistics(date?: any) {
    return this._homeActions.getRefundStatistics(date);
  }

  //Wavier
  getWaiverStatistics(date?: any) {
    return this._homeActions.getWaiverStatistics(date);
  }

  //SponsorshipTransfer
  getSponsorshipTransferStatistics(date?: any) {
    return this._homeActions.getSponsorshipTransferStatistics(date);
  }

  //Rent
  getAllRent(date?: any) {
    return this._homeActions.getAllRent(date);
  }

  // Format Date
  formatDate(date: Date) {
    // return date;
  }
}
