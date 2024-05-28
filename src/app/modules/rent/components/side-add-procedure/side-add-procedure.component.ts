import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RentService } from '../../services/rent.service';
import { IRent, IRentLogProcedure, RentTypeEnum } from '../../models/rent.interface';
import { IEnum } from 'src/app/core/interfaces';
import { IRentPrice } from 'src/app/modules/settings/models';
import { IResponse } from 'src/app/core/models';
import { DatePipe } from '@angular/common';
import { IWorkerFormData } from 'src/app/modules/worker/models';
import { RentPriceService } from 'src/app/modules/settings/services/rent-price.service';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { of, tap } from 'rxjs';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';

@UntilDestroy()
@Component({
  selector: 'side-add-procedure',
  templateUrl: './side-add-procedure.component.html',
  styleUrls: ['./side-add-procedure.component.scss'],
  providers: [DatePipe],
})
export class SideAddProcedureComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  // #region Properties
  public data: any;
  public update = false;
  public form!: FormGroup;
  public isLoading = false;
  public rentTypes!: IEnum[];
  public procedures!: IEnum[];
  public rentData!: IRent | null;
  public rentPrice!: IRentPrice | null;
  public rentPriceValue!: number | undefined;
  public companyTaxValue!: number;
  public taxTypes!: IEnum[];
  public rentRequest?: IRent;
  public monthlySalary = 0;
  public contractProcedures!: IRentLogProcedure[];
  // #endregion

  //#region Accessors
  get f() {
    return this.form.controls;
  }

  get rentValue(): number {
    const rentTypeId = this.f['rentTypeId']?.value;
    return (
      this.rentTypes?.find(r => {
        return r.id === rentTypeId;
      })?.value || -1
    );
  }

  get procedureValue(): number {
    const procedureId = this.f['procedureId']?.value;
    return (
      this.procedures?.find(r => {
        return r.id === procedureId;
      })?.value || -1
    );
  }

  get rentPeriodUnit() {
    switch (this.rentValue) {
      case 1:
        return 'day';
      case 2:
        return 'month';
      case 3:
        return 'day';
      case 4:
        return 'year';
      default:
        return 'day';
    }
  }
  // #endregion

  constructor(
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private _snackBar: NotifierService,
    public _rentService: RentService,
    @Inject(INJECTOR) injector: Injector,
    private _rentPriceService: RentPriceService,
    private _taxHandlerService: TaxHandlerService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, Validators.required],
      rentPeriod: [0, [Validators.required, Validators.min(1)]],
      realCustomerContractPeriod: [0, [Validators.required, Validators.min(1)]],
      fine: [0, [Validators.required, Validators.min(1)]],
      workerSalary: [0, [Validators.required, Validators.min(1)]],
      retrieveDate: [null, [Validators.required]],
      officeAmount: [0, [Validators.required, Validators.min(1)]],
      returnCustomerAmount: [0, [Validators.required, Validators.min(1)]],
      restPeriod: [0, [Validators.required, Validators.min(1)]],
      totalPeriod: [0, [Validators.required, Validators.min(1)]],
      returnRefuseReason: [null, Validators.nullValidator],
      rentRequestId: [null, Validators.required],
      procedureId: [null, Validators.required],
      rentTypeId: [null, [Validators.required, Validators.min(1)]],
      fromDateMilady: [null],
      toDateMilady: [null],
      rentAmount: [0, [Validators.required]],
      rentAmountWithTax: [0],
      rentAmountWithoutTax: [0],
      taxTypeId: [0, Validators.required],
      taxAmount: [0],
      totalAmountWithoutTax: [0],
      note: [''],
    });
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._rentService.sidenavAddProcedure.next(this.sidenav);
    this._rentService
      .getSelectedProcedureSubject()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.data = data;
        if (data?.rentInfo && data?.procedure) {
          this.rentData = data.rentInfo as IRent;
          this.update = true;
          this.fetchData(this.rentData.id || '');
          this.getWorkerDetails(this.rentData?.workerId);
          this.form.patchValue({
            rentRequestId: this.rentData?.id,
            procedureId: data.procedure?.procedureId,
            id: data.procedure?.id,
            date: data.procedure.date,
            rentPeriod: data.procedure.rentPeriod,
            realCustomerContractPeriod: data.procedure.realCustomerContractPeriod,
            fine: data.procedure.fine,
            workerSalary: data.procedure.workerSalary,
            retrieveDate: data.procedure.retrieveDate,
            officeAmount: data.procedure.officeAmount,
            returnCustomerAmount: data.procedure.returnCustomerAmount,
            restPeriod: data.procedure.restPeriod,
            totalPeriod: data.procedure.totalPeriod,
            returnRefuseReason: data.procedure.returnRefuseReason,
          });
        }
        if (data && data?.id) {
          this.rentData = data as IRent;
          this.fetchData(this.rentData.id || '');
          this.getWorkerDetails(this.rentData?.workerId);
          this.update = false;
          this.sidenav.open();
          this.form.patchValue({
            rentRequestId: this.rentData?.id,
          });
        }
        this.watchFormControls();
      });
  }

  watchFormControls() {
    this.renderContractInfo();
    this.watchRentTypeControl();
    this.watchFromDateMiladyControl();
    this.watchDaysControl();
    this.watchFormData();
  }

  renderContractInfo() {
    this.form
      .get('rentRequestId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(rentRequestId => {
        if (rentRequestId) {
          this.fetchRentRequestDetails(rentRequestId);
          this.fetchLastProcedures(rentRequestId);
        }
      });
  }

  fetchRentRequestDetails(rentRequestId: string) {
    this._rentService
      .infoRent(rentRequestId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: IResponse<IRent>) => {
          this.rentRequest = response.data;
          this.fillTaxFieldsValue();
          this.getWorkerDetails(this.rentRequest.workerId);
        },
      });
  }

  fillTaxFieldsValue() {
    this.form.patchValue({
      rentAmount: this.rentRequest?.rentAmount,
      rentAmountWithTax: this.rentRequest?.rentAmountWithTax,
      rentAmountWithoutTax: this.rentRequest?.rentAmountWithoutTax,
      rentPeriod: this.rentRequest?.rentDaysPeriod,
      rentHoursPeriod: this.rentRequest?.rentHoursPeriod,
      rentTypeId: this.rentRequest?.rentTypeId,
      taxAmount: this.rentRequest?.taxAmount,
      taxTypeId: this.rentRequest?.taxType,
    });
  }

  fetchLastProcedures(rentRequestId: string) {
    this._rentService
      .lastProcedures(rentRequestId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.contractProcedures = response.data;
        this.updateValidation(
          this.form,
          [
            'returnRefuseReason',
            'totalPeriod',
            'restPeriod',
            'returnCustomerAmount',
            'officeAmount',
            'retrieveDate',
            'workerSalary',
            'fine',
            'realCustomerContractPeriod',
            'rentPeriod',
          ],
          Validators.nullValidator
        );
      });
  }

  getWorkerDetails(workerId: string) {
    this.rentPrice = null;
    this.workerServiceCh
      .infoWorker(workerId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IWorkerFormData>) => this.getCountryRentSalePrices(response.data.countryId));
  }

  getCountryRentSalePrices(countryId: string) {
    this._rentPriceService
      .getCountryRentPrices(countryId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.rentPrice = response.data;
        if (this.rentPrice) {
          this.rentPriceValue = this.rentPrice.prices.find(price =>
            price?.rentType?.id == this.rentData?.rentTypeId ? this.rentData?.rentTypeId : this.rentData?.rentType?.id
          )?.price;
          this.calculateWorkerSalary();
        }
      });
  }

  watchDaysControl() {
    this.f['rentPeriod']?.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
  }

  watchFromDateMiladyControl() {
    this.f['fromDateMilady']?.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
  }

  watchRentTypeControl() {
    this.f['rentTypeId']?.valueChanges.pipe(untilDestroyed(this)).subscribe(rentTypeId => {
      this.rentPriceValue = this.rentPrice?.prices.find(price => price?.rentType?.id === rentTypeId)?.price;
      this.calculateDifferentDates();
      this.calculateWorkerSalary();
    });
  }

  watchFormData() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(data => {
      if (this.procedureValue == 4) {
        const rentAmount = +data['rentAmount'];
        //extension procedure
        if (rentAmount >= 0 && this.companyTaxValue >= 0 && this.companyTaxValue < 100) {
          this.processingRentDays();
          const taxType = this.taxTypes.find(
            type =>
              (this.form.get('taxTypeId')?.value?.id
                ? this.form.get('taxTypeId')?.value?.id
                : this.form.get('taxTypeId')?.value) === type.id
          )?.value;
          if (taxType) {
            const taxAmount = this._taxHandlerService.calcTaxAmount(taxType, rentAmount, 0, +this.companyTaxValue);
            const withTaxAmount = taxAmount + rentAmount;

            if (this.f['rentPeriod'].value == null) this.f['rentPeriod'].patchValue(1, { emitEvent: false });

            const rentAmountTotalWithoutTaxAmount = (rentAmount * this.f['rentPeriod'].value).toFixed(2);
            const rentAmountTotalWithTaxAmount = (withTaxAmount * this.f['rentPeriod'].value).toFixed(2);
            this.form.patchValue(
              {
                taxAmount: taxAmount,
                rentAmountWithTax: rentAmountTotalWithTaxAmount,
                rentAmountWithoutTax: rentAmountTotalWithoutTaxAmount,
              },
              { emitEvent: false }
            );
          }
        }
      } else if (this.procedureValue == 5 && this.rentRequest) {
        //retrieve procedure
        const retrieveDate = data['retrieveDate'];
        const contractStartDate = this.rentRequest.fromDateMilady;
        if (retrieveDate && contractStartDate) {
          const days = this.helperService.daysDiff(new Date(contractStartDate), new Date(retrieveDate));
          this.f['realCustomerContractPeriod'].patchValue(days, { emitEvent: false });
          // this.calculateWorkerSalary();
          if (this.rentPriceValue) {
            const totalDays = this.helperService.daysDiff(new Date(contractStartDate), new Date(retrieveDate));
            this.f['officeAmount'].patchValue((totalDays / this.rentValue) * this.rentPriceValue, {
              emitEvent: false,
            });
            this.f['workerSalary'].patchValue((this.monthlySalary / 30) * totalDays, {
              emitEvent: false,
            });
            // for customer
            const restDays = this.helperService.daysDiff(
              new Date(retrieveDate),
              new Date(this.rentRequest.toDateMilady)
            );
            this.f['returnCustomerAmount'].patchValue((restDays / this.rentValue) * this.rentPriceValue, {
              emitEvent: false,
            });
            this.f['restPeriod'].patchValue(restDays, {
              emitEvent: false,
            });
          }
        }
        // this.f['rentPeriod'].patchValue(this.rentRequest.rentDaysPeriod, { emitEvent: false });
      }
    });
  }

  calculateWorkerSalary() {
    const retrieveDate = this.f['retrieveDate'].value;
    const contractDate = this.rentData?.requestDateMilady;
    if (retrieveDate && contractDate && this.rentPriceValue) {
      let days = this.helperService.daysDiff(new Date(contractDate), new Date(retrieveDate));
      this.f['workerSalary'].patchValue(days * this.rentPriceValue, { emitEvent: false });
    }
  }

  calculateDifferentDates() {
    const rentTypeId = this.f['rentTypeId']?.value;
    if (!rentTypeId) return;
    const fromDate = this.f['fromDateMilady']?.value;
    const addedPeriodValue: number = this.f['rentPeriod']?.value;
    if (this.f['rentPeriod'].value == null) this.f['rentPeriod'].patchValue(1, { emitEvent: false });
    if (rentTypeId && this.rentValue != RentTypeEnum.HOUR && addedPeriodValue > 0 && fromDate) {
      const date = new Date(fromDate);
      const toDate = new Date(fromDate);
      if (this.rentValue == RentTypeEnum.DAY) toDate.setDate(+date.getDate() + +addedPeriodValue);
      if (this.rentValue == RentTypeEnum.MONTH) toDate.setMonth(+date.getMonth() + +addedPeriodValue);
      if (this.rentValue == RentTypeEnum.YEAR) toDate.setFullYear(+date.getFullYear() + +addedPeriodValue);
      const endDate = this.datePipe.transform(toDate, 'MM/dd/YYYY');
      this.f['toDateMilady']?.patchValue(endDate);
    }
  }

  processingRentDays() {
    if (this.rentValue == RentTypeEnum.HOUR) {
      this.f['rentPeriod'].patchValue(1, { emitEvent: false });
    }
  }

  // #region Fetch
  fetchData(id: string) {
    this.fetchRentProcedures(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => (this.procedures = response.data));
    this.fetchRentTypesValues();
    this.fetchTaxTypesValues();
    this.getCompanyTaxValue();
  }

  fetchTaxTypesValues() {
    this.fetchTaxTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.taxTypes = res.data;
      });
  }

  getCompanyTaxValue() {
    this.getCompanyTax()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.companyTaxValue = res.data;
      });
  }

  fetchRentTypesValues() {
    this.fetchRentTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.rentTypes = res.data));
  }

  fetchRequestProceduresSelect = () => {
    if (this.rentData?.id)
      return this.fetchRentProcedures(this.rentData.id).pipe(
        tap(res => {
          this.procedures = res.data;
        })
      );
    else return of([]);
  };
  // #endregion

  addProcedure() {
    this.isLoading = true;
    this.update = false;
    this._rentService.createRentProcedure(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this._snackBar.showNormalSnack(this.translateService.instant('toast.procedure_added_to_contract_successfully'));
        this._rentService.setLogProcedureIdSubject(null);
        this.sidenav.close();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  updateProcedure() {
    this.isLoading = true;
    this.update = true;
    this._rentService.createRentProcedure(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this._rentService.setLogProcedureIdSubject(null);
        this.sidenav.close();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  close() {
    this.sidenav.close();
    this.form.reset();
    this._rentService.setSelectedProcedureSubject(null);
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.sidenav.close();
    this._rentService.setSelectedProcedureSubject(null);
    super.ngOnDestroy();
  }
}
