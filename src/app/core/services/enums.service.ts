import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnum } from '../interfaces';
import { IResponse } from '../models';
import { HttpClient } from '@angular/common/http';
import { EnumActions } from '../actions/enum.actions';

@Injectable({ providedIn: 'root' })
export class EnumService {
  private _enumActions: EnumActions;

  constructor(private _http: HttpClient) {
    this._enumActions = new EnumActions(_http);
  }
  getDelegationStatuses() {
    return this._enumActions.getDelegationStatuses();
  }
  getMaritalStatuses(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getMaritalStatus();
  }
  getComplaintsStatus(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getComplaintsStatus();
  }
  getBenefitTypes() {
    return this._enumActions.getBenefitTypes();
  }
  getCommissionHolderTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getCommissionHolderTypes();
  }

  getCustomerTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getCustomerTypes();
  }

  getBusinessPositions(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getBusinessPositions();
  }

  getIdentificationTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getIdentificationTypes();
  }

  getHomeTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getHomeTypes();
  }

  genderData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getGenders();
  }
  getPriorities(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getPriorities();
  }
  getTasksStatuses(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getTasksStatuses();
  }

  religionsData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getReligions();
  }

  getVATProcesses(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getVATProcesses();
  }

  getCustomerFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getCustomerFinancialStatus();
  }

  languageLevelData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getLanguageLevels();
  }

  cvTypeData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getCVTypes();
  }
  financialStatus(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getOrderFinancialStatus();
  }
  sponsorTransferTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getSponsorTransferTypes();
  }
  ages(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.ages();
  }

  taxTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getTaxTypes();
  }
  getMovementTransaction(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getMovementTransaction();
  }

  musanedRequestTypes(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getMusanedRequestTypes();
  }

  getStatus(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getStatus();
  }

  rentTypeData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getRentTypes();
  }

  receivingTypesData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getReceivingTypes();
  }

  requestStatusData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getRequestStatus();
  }

  financialStatusData(): Observable<IResponse<IEnum[]>> {
    return this._enumActions.getFinancialStatus();
  }

  getCustomerProcedures() {
    return this._enumActions.getCustomerProcedures();
  }
  getTemplateCategories() {
    return this._enumActions.getTemplateCategories();
  }
  getEmployeeTypes() {
    return this._enumActions.getEmployeeTypes();
  }
  getCommissionTypes() {
    return this._enumActions.getCommissionTypes();
  }
  getCommissionSections() {
    return this._enumActions.getCommissionSections();
  }
  getBillTypes() {
    return this._enumActions.getBillTypes();
  }
  getPaymentDestinations() {
    return this._enumActions.getPaymentDestinations();
  }
  getSideTypes() {
    return this._enumActions.getSideTypes();
  }
  getReceiptTypes() {
    return this._enumActions.getReceiptTypes();
  }

  getMainServices() {
    return this._enumActions.getMainServices();
  }
  getParallelServices(mainServiceId: string) {
    return this._enumActions.getParallelServices(mainServiceId);
  }
  getReturnedBillsTypes() {
    return this._enumActions.getReturnedBillsTypes();
  }
  getNotificationsTypes() {
    return this._enumActions.getNotificationsTypes();
  }
}
