import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEnum } from '../interfaces';

export class EnumActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Enum');
  }
  getDelegationStatuses(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetDelegationStatus');
  }
  getMaritalStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetMaritalStatus');
  }
  getComplaintsStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetComplaintsStatus');
  }
  getBenefitTypes() {
    return this.readEntities('GetBenefitTypes');
  }
  getCommissionHolderTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCommissionHolderTypes');
  }

  getCustomerTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCustomerTypes');
  }

  getBusinessPositions(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetBusinessPositions');
  }

  getIdentificationTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetIdentificationTypes');
  }

  getHomeTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetHomeTypes');
  }

  getGenders(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetGenders');
  }
  getPriorities(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetPriorities');
  }
  getTasksStatuses(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetTasksStatuses');
  }

  getReligions(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetReligions');
  }

  getVATProcesses(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetVATProcesses');
  }

  getCustomerFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCustomerFinancialStatus');
  }

  getLanguageLevels(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetLanguageLevels');
  }

  getCVTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCVTypes');
  }
  getOrderFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetFinancialStatus');
  }
  getSponsorTransferTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetSponsorshipTransferTypes');
  }
  ages(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetAges');
  }

  getTaxTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetTaxTypes');
  }
  getMovementTransaction(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetFinancialTransactionTypes');
  }

  getMusanedRequestTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetMusanedRequestTypes');
  }

  getStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetStatus');
  }

  getRentTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetRentTypes');
  }

  getReceivingTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetReceivingTypes');
  }

  getRequestStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetRequestStatus');
  }

  getFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetFinancialStatus');
  }

  getCustomerProcedures(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCustomerProcedures');
  }
  getEmployeeTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetEmployeeTypes');
  }
  getCommissionTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCommissionTypes');
  }
  getCommissionSections(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetCommissionSections');
  }
  getTemplateCategories(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetTemplateCategories');
  }
  getBillTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetBillTypes');
  }
  getPaymentDestinations(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetPaymentDestinations');
  }
  getSideTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetSideTypes');
  }
  getReceiptTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetReceiptTypes');
  }
  getMainServices(): Observable<IResponse<IEnum[]>> {
    return this.readEntities('GetMainServices');
  }
  getParallelServices(mainServiceId: string): Observable<IResponse<IEnum[]>> {
    return this.readEntities(`GetParallelServices/${mainServiceId}`);
  }
  getReturnedBillsTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities(`GetReturnedBillsTypes`);
  }
  getNotificationsTypes(): Observable<IResponse<IEnum[]>> {
    return this.readEntities(`getNotificationTypes`);
  }
}
