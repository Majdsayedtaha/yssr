import { saveAs } from 'file-saver';
import { Observable, Subscription, map } from 'rxjs';
import { environment } from '@environments/environment';
// Interfaces
import { IDetail, IEnum } from '../../interfaces';
import { IPagination, IResponse } from '../../models';
import { IRolePermissionsEnum } from '../../constants';
import { IName } from 'src/app/modules/settings/models';
import { IHousing } from 'src/app/modules/housing/models';
import { IEmployee } from 'src/app/modules/employees/interfaces/employee.interfaces';
//Components
import { AgTemplateComponent } from '../ag-custom-grid/ag-template/ag-template.component';
//Angular
import { Injector } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
//Services
import { EnumService } from '../../services/enums.service';
import { JobService } from '../../services/settings/job.service';
import { CityService } from '../../services/settings/city.service';
import { VisaService } from '../../services/settings/visa.service';
import { DirectionService } from '../../services/direction.service';
import { SkillService } from '../../services/settings/skill.service';
import { PermissionService } from '../../services/permission.service';
import { RegionService } from '../../services/settings/region.service';
import { DetailService } from '../../services/settings/detail.service';
import { CountryService } from '../../services/settings/country.service';
import { RentService } from 'src/app/modules/rent/services/rent.service';
import { FilterStrategy } from '../ag-custom-grid/strategy/filter.strategy';
import { WorkerService } from 'src/app/modules/worker/services/worker.service';
import { ProceduresService } from '../../services/settings/procedures.service';
import { WaiverService } from 'src/app/modules/waiver/services/waiver.service';
import { HelperFunctionsService } from '../../services/helper-functions.service';
import { HousingService } from 'src/app/modules/housing/services/housing.service';
import { CompanyService } from 'src/app/modules/settings/services/company.service';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { TemplatesService } from 'src/app/modules/settings/services/template.service';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { RepresentativeService } from '../../services/settings/representative.service';
import { ExperienceTypeService } from '../../services/settings/experience-type.service';
import { ExternalOfficeService } from '../../services/settings/external-office.service';
import { ArrivalStationService } from '../../services/settings/arrival-station.service';
import { RefundService } from 'src/app/modules/refund-management/services/refund.service';
import { BranchManagerSelectService } from '../../services/branch-manager-select.service';
import { ExternalOfficeUserService } from 'src/app/modules/settings/services/external-office-user.service';
import { ContractProcedureService } from 'src/app/modules/recruitment-contracts/services/contract-procedure.service';
import { SalesReboundService } from 'src/app/modules/financial-management/modules/sales-rebound/services/sales-rebound.service';
import { BankService } from 'src/app/modules/financial-management/modules/settings/services/bank.service';
import { StoreService } from 'src/app/modules/financial-management/modules/settings/services/store.service';
import { ReceiptService } from 'src/app/modules/financial-management/modules/receipt/services/receipt.service';
import { NetworkService } from 'src/app/modules/financial-management/modules/settings/services/network.service';
import { DeviceService } from 'src/app/modules/financial-management/modules/settings/services/device.service';
import { ExchangeService } from 'src/app/modules/financial-management/modules/bills-exchange/services/exchange.service';
import { ExpenseService } from 'src/app/modules/financial-management/modules/settings/services/expense.service';

export class CoreBaseComponent extends AgTemplateComponent {
  protected selectedStepIndex!: number;
  protected isLinearStepper = true;
  protected enableFilterAndSortOfTable = true;
  protected drawerSideNav!: MatDrawer;

  //#region Services
  protected direction = this.injector.get(DirectionService);
  protected enumService = this.injector.get(EnumService);
  protected jobService = this.injector.get(JobService);
  protected countryService = this.injector.get(CountryService);
  protected regionService = this.injector.get(RegionService);
  protected cityService = this.injector.get(CityService);
  protected experienceTypeService = this.injector.get(ExperienceTypeService);
  protected externalOfficeService = this.injector.get(ExternalOfficeService);
  protected housingService = this.injector.get(HousingService);
  protected skillService = this.injector.get(SkillService);
  protected detailService = this.injector.get(DetailService);
  protected visaService = this.injector.get(VisaService);
  protected representativeService = this.injector.get(RepresentativeService);
  protected arrivalStationService = this.injector.get(ArrivalStationService);
  protected customerServiceCh = this.injector.get(CustomerService);
  protected workerServiceCh = this.injector.get(WorkerService);
  protected employeesService = this.injector.get(EmployeesService);
  protected contractProcedureService = this.injector.get(ContractProcedureService);
  protected proceduresService = this.injector.get(ProceduresService);
  protected refundService = this.injector.get(RefundService);
  protected templateService = this.injector.get(TemplatesService);
  protected helperService = this.injector.get(HelperFunctionsService);
  protected externalOfficeUserService = this.injector.get(ExternalOfficeUserService);
  protected branchesManagersSelect = this.injector.get(BranchManagerSelectService);
  protected companyService = this.injector.get(CompanyService);
  protected permissionService = this.injector.get(PermissionService);
  protected rentService = this.injector.get(RentService);
  protected waiverService = this.injector.get(WaiverService);
  protected billSaleReturn = this.injector.get(SalesReboundService);
  protected bankService = this.injector.get(BankService);
  protected storeService = this.injector.get(StoreService);
  protected networkService = this.injector.get(NetworkService);
  protected deviceService = this.injector.get(DeviceService);
  protected expenseService = this.injector.get(ExpenseService);
  protected receiptService = this.injector.get(ReceiptService);
  protected exchangeService = this.injector.get(ExchangeService);
  protected filterStrategy: FilterStrategy = new FilterStrategy();
  public subjectSub?: Subscription;
  public acceptableAge!: Date;
  public currentAge!: Date;
  //#endregion

  //#region Variables
  protected isRTL: boolean = false;
  protected authCanView = IRolePermissionsEnum.canView;
  protected authCanAdd = IRolePermissionsEnum.canAdd;
  protected authCanUpdate = IRolePermissionsEnum.canUpdate;
  protected authCanDelete = IRolePermissionsEnum.canDelete;
  //#endregion
  constructor(public injectorChild: Injector) {
    super(injectorChild);
    this.filterStrategy = this.injector.get(FilterStrategy);
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    this.acceptableAge = new Date(`${year - 10}-${month + 1}-${day}`);
    this.currentAge = new Date(`${year}-${month + 1}-${day}`);
  }

  //#region Helpers
  public getDirection = () => this.direction.getDirection();
  public getTranslation = (key: string, object: Object = {}): string => this.translateService.instant(key, object);
  public getTranslations = (keys: string[]): string[] => keys.map(key => this.getTranslation(key));

  public downloadURL(url: string | undefined, fileName: string) {
    if (url) {
      const URL = [environment.baseURL, url].join('/');
      const extension = URL.substring(URL.length - 3);
      saveAs(URL, `${fileName}.${extension}`);
    }
  }

  public downloadFile(content: any, fileName: string, contentType: string) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  //#endregion

  //#region Enum
  fetchDelegationStatuses(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getDelegationStatuses();
  }

  fetchBenefitTypes() {
    return this.enumService.getBenefitTypes();
  }

  fetchMaritalStatuses(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getMaritalStatuses();
  }

  fetchComplaintsStatus(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getComplaintsStatus();
  }

  fetchCommissionHolderTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getCommissionHolderTypes();
  }

  getCustomers(value?: string, page?: number) {
    return this.customerServiceCh
      .getCustomersList({ query: value || '', pageNumber: typeof page == 'number' ? page.toString() : '' })
      .pipe(
        map(res => {
          return { data: res.data.list };
        })
      );
  }

  getRentCustomersSelect() {
    return this.customerServiceCh.getRentCustomersSelect();
  }

  getWorkers() {
    return this.workerServiceCh.getWorkersList(null).pipe(
      map(res => {
        return { data: res.data.list };
      })
    );
  }

  getCustomerTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getCustomerTypes();
  }

  getBusinessPositions(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getBusinessPositions();
  }

  getIdentificationTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getIdentificationTypes();
  }

  getHomeTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getHomeTypes();
  }

  getGenderListData(): Observable<IResponse<IEnum[]>> {
    return this.enumService.genderData();
  }

  getPriorities(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getPriorities();
  }

  getTasksStatuses(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getTasksStatuses();
  }

  fetchReligions(): Observable<IResponse<IEnum[]>> {
    return this.enumService.religionsData();
  }

  getVATProcesses(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getVATProcesses();
  }

  getCustomerFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getCustomerFinancialStatus();
  }

  fetchLanguageLevels(): Observable<IResponse<IEnum[]>> {
    return this.enumService.languageLevelData();
  }

  fetchCVTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.cvTypeData();
  }

  fetchSponsorTransferTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.sponsorTransferTypes();
  }
  fetchAges(): Observable<IResponse<IEnum[]>> {
    return this.enumService.ages();
  }

  fetchTaxTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.taxTypes();
  }

  fetchMusanedRequestTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.musanedRequestTypes();
  }

  fetchStatus(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getStatus();
  }

  fetchRentTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.rentTypeData();
  }

  fetchReceivingTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.receivingTypesData();
  }

  fetchRequestStatus(): Observable<IResponse<IEnum[]>> {
    return this.enumService.requestStatusData();
  }

  fetchFinancialStatus(): Observable<IResponse<IEnum[]>> {
    return this.enumService.financialStatusData();
  }

  fetchEmployeeTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getEmployeeTypes();
  }

  fetchCommissionTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getCommissionTypes();
  }

  fetchCommissionSections(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getCommissionSections();
  }

  getCustomerProcedures() {
    return this.enumService.getCustomerProcedures();
  }

  fetchTemplateCategories() {
    return this.enumService.getTemplateCategories();
  }

  getBillTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getBillTypes();
  }

  getPaymentDestinations(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getPaymentDestinations();
  }

  getSideTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getSideTypes();
  }

  getReceiptTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getReceiptTypes();
  }

  getMainServices(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getMainServices();
  }

  getParallelServices(mainServiceId: string): Observable<IResponse<IEnum[]>> {
    return this.enumService.getParallelServices(mainServiceId);
  }

  getReturnedBillsTypes(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getReturnedBillsTypes();
  }

  getExpensesTypesSelect() {
    return this.exchangeService.getExpensesTypesSelect();
  }

  getContractsForExchange(externalOfficeId: string, value?: string, page?: number) {
    return this.exchangeService.getContractsForExchange(externalOfficeId, value, page);
  }

  //#endregion

  //#region Settings
  getRegions(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.regionService.getRegions(value, page);
  }

  getRegionCities(regionId: string, value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.cityService.getRegionCities(regionId, value, page);
  }

  fetchExperienceTypes(): Observable<IResponse<IEnum[]>> {
    return this.experienceTypeService.experienceTypeData();
  }

  fetchExternalOffices(value?: string, page?: number, queryParams?: any): Observable<IResponse<IEnum[]>> {
    return this.externalOfficeService.externalOfficeData(value, page, queryParams);
  }

  fetchRepresentatives(): Observable<IResponse<IEnum[]>> {
    return this.representativeService.representatives();
  }

  fetchApartments(value?: string, page?: number): Observable<IResponse<IEnum[] | IHousing[]>> {
    return this.housingService.apartmentsData(value, page);
  }

  fetchSkills(): Observable<IResponse<IEnum[]>> {
    return this.skillService.skillData();
  }

  fetchMovementTransaction(): Observable<IResponse<IEnum[]>> {
    return this.enumService.getMovementTransaction();
  }

  fetchDetails(): Observable<IResponse<IDetail[]>> {
    return this.detailService.detailData();
  }

  fetchVisaTypes(): Observable<IResponse<IEnum[]>> {
    return this.visaService.visaTypes();
  }

  fetchArrivalStation(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.arrivalStationService.arrivalStations(value, page);
  }

  fetchEmployeesSelect(
    withCommission: boolean | null = null,
    countryId: string | null = null,
    type: number | null = null
  ): Observable<IResponse<IEnum[] | IEmployee[]>> {
    return this.employeesService.getAllEmployeesSelect(withCommission, countryId, type);
  }

  fetchCustomerProcedures(contractId?: string, query?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.proceduresService.getAllProceduresSelect(contractId, query, page);
  }

  getCustomerRentRequestsSelect(customerId?: string, query?: string, page?: number) {
    return this.rentService.getCustomerRentRequestsSelect(customerId, query, page);
  }

  fetchRentRequests(value?: string, page?: number) {
    return this.rentService.getRentsSelect({
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  fetchReturnProcedures(contractId?: string): Observable<IResponse<IEnum[]>> {
    return this.proceduresService.getAllProceduresReturnSelect(contractId);
  }

  fetchRentProcedures(id?: string): Observable<IResponse<IEnum[]>> {
    return this.proceduresService.getAllProceduresRentSelect(id);
  }
  getWaiverRequestsProcedures(id: string): Observable<IResponse<IEnum[]>> {
    return this.proceduresService.getWaiverRequestsProcedures(id);
  }

  fetchEmailTemplate(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.templateService.getEmailTemplates();
  }

  fetchSmsTemplate(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.templateService.getSMSTemplates();
  }

  getEmailTemplatesSelect(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.templateService.getEmailTemplatesSelect();
  }

  getSMSTemplatesSelect(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.templateService.getSMSTemplatesSelect();
  }

  fetchCountries(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.countryService.getCountries(value, page);
  }

  fetchJobs(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.jobService.jobData(value, page);
  }

  fetchAllJobsSearchableSelect = (value?: string, page?: number) => {
    return this.fetchJobs(value, page);
  };

  fetchRoles(value?: string, page?: number): Observable<IResponse<IEnum[]>> {
    return this.permissionService.getAllRoles(value, page);
  }

  getReturnRequests(): Observable<IResponse<IEnum[]>> {
    return this.refundService.getReturnRequestsSelect();
  }

  getReturnWorkers(): Observable<IResponse<IEnum[]>> {
    return this.refundService.getReturnWorkersSelect();
  }

  getRepresentativesSelect(id: string, value?: string, page?: number): Observable<IResponse<IPagination<IName, {}>>> {
    return this.externalOfficeUserService.getRepresentativesSelect(id, value, page);
  }

  getBranchesManagersSelect(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.branchesManagersSelect.getBranchesManagersSelect();
  }

  getMainBillsSelect(id: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.billSaleReturn.getMainBillsSelect({ id, value, page });
  }

  getBanksSelect(id?: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.bankService.getBanksSelect({ id, value, page });
  }

  getStoreSelect(id?: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.storeService.getStoreSelect({ id, value, page });
  }

  getNetworksSelect(id?: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.networkService.getNetworksSelect({ id, value, page });
  }

  getDevicesSelect(id?: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.deviceService.getDevicesSelect({ id, value, page });
  }

  getExpenseSelect(id?: string, value?: string, page?: number): Observable<IResponse<IPagination<any, {}>>> {
    return this.expenseService.getExpensesSelect({ id, value, page });
  }

  getCompanyTax(): Observable<IResponse<any>> {
    return this.companyService.getCompanyTax();
  }

  getWaiverRequestsSelect(value?: string, page?: number) {
    return this.waiverService.getWaiverRequestsSelect(value, page);
  }

  fetchCustomerBills(customerId: number) {
    return this.receiptService.fetchCustomerBills(customerId);
  }
  //#end region

  //#region Stepper
  stepSelectionChange(event: StepperSelectionEvent, stepper: MatStepper) {
    // TODO: Store Step & Data In Session.
    // this.selectedStepIndex = event.selectedIndex;
    // this.preventTriggerValidationStepper(stepper);
  }

  preventTriggerValidationStepper(stepper: MatStepper) {
    // if (stepper.selected) stepper.selected.interacted = false;
  }
  //#endregion

  // #region Form Processing
  updateValidation(formGroup: FormGroup, formControlNames: string[], validators: ValidatorFn[][] | ValidatorFn) {
    formControlNames.forEach((control, idx) => {
      formGroup.controls[control].setValidators(Array.isArray(validators) ? validators[idx] : validators);
      formGroup.controls[control].updateValueAndValidity();
    });
  }
  //#endregion
}
