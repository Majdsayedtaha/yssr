import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RentService } from '../../services/rent.service';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe, Location } from '@angular/common';
import { IEnum } from 'src/app/core/interfaces';
import { IRent, IRentLogProcedure, RentTypeEnum } from '../../models/rent.interface';
import { IResponse } from 'src/app/core/models';
import { IRentPrice } from 'src/app/modules/settings/models';
import { IWorkerFormData } from 'src/app/modules/worker/models';
import { RentPriceService } from 'src/app/modules/settings/services/rent-price.service';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { of, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-rent-procedure-form',
  templateUrl: './rent-procedure-form.component.html',
  styleUrls: ['./rent-procedure-form.component.scss'],
  providers: [DatePipe],
})
export class RentProcedureFormComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public form!: FormGroup;
  public loading: boolean = false;
  public workers: IEnum[] = [];
  public rentRequest?: IRent;
  public contractProcedures!: IRentLogProcedure[];
  public procedures!: IEnum[];
  public renderNumber!: number;
  public rentTypes!: IEnum[];
  public rentPrice!: IRentPrice | null;
  public rentPriceValue!: number | undefined;
  public companyTaxValue!: number;
  public taxTypes!: IEnum[];
  public monthlySalary = 0;
  //#endregion

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
    @Inject(INJECTOR) injector: Injector,
    private _rentService: RentService,
    public location: Location,
    private _router: Router,
    private _rentPriceService: RentPriceService,
    private fb: FormBuilder,
    private _taxHandlerService: TaxHandlerService,
    public datePipe: DatePipe
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchData();
    this.initialForm();
    this.watchFormControls();
  }

  //#region Form
  initialForm() {
    this.form = this.fb.group({
      customerId: [null, Validators.required],
      date: [null, Validators.nullValidator],
      rentPeriod: [null, [Validators.nullValidator, Validators.min(1)]],
      realCustomerContractPeriod: [null, [Validators.nullValidator, Validators.min(1)]],
      fine: [null, [Validators.nullValidator, Validators.min(1)]],
      workerSalary: [null, [Validators.nullValidator, Validators.min(1)]],
      retrieveDate: [null, [Validators.nullValidator]],
      officeAmount: [null, [Validators.nullValidator, Validators.min(1)]],
      returnCustomerAmount: [null, [Validators.nullValidator, Validators.min(1)]],
      restPeriod: [null, [Validators.nullValidator, Validators.min(1)]],
      totalPeriod: [null, [Validators.nullValidator, Validators.min(1)]],
      returnRefuseReason: [null, Validators.nullValidator],
      rentRequestId: [null, Validators.nullValidator],
      procedureId: [null, Validators.nullValidator],
      rentTypeId: [null, Validators.nullValidator],
      fromDateMilady: [null, Validators.nullValidator],
      toDateMilady: [null, Validators.nullValidator],
      rentAmount: [0, [Validators.required]],
      rentAmountWithTax: [0],
      rentAmountWithoutTax: [0],
      taxTypeId: [0, Validators.required],
      taxAmount: [0],
      totalAmountWithoutTax: [0],
      note: [null],
    });
  }

  watchFormControls() {
    this.renderContractInfo();
    this.watchRentTypeControl();
    this.watchFromDateMiladyControl();
    this.watchDaysControl();
    this.watchFormData();
    this.watchCustomerChanges();
  }

  watchCustomerChanges() {
    this.f['customerId'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.contractProcedures = [];
      this.rentRequest = undefined;
      this.form.patchValue({
        rentPeriod: null,
        realCustomerContractPeriod: null,
        fine: null,
        workerSalary: null,
        retrieveDate: null,
        officeAmount: null,
        returnCustomerAmount: null,
        restPeriod: null,
        totalPeriod: null,
        returnRefuseReason: null,
        rentRequestId: null,
        procedureId: null,
        rentTypeId: null,
        fromDateMilady: null,
        toDateMilady: null,
        rentAmount: 0,
        rentAmountWithTax: 0,
        rentAmountWithoutTax: 0,
        taxTypeId: 0,
        taxAmount: 0,
        totalAmountWithoutTax: 0,
        note: null,
      });
    });
  }

  watchDaysControl() {
    this.f['rentPeriod'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
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

  watchFromDateMiladyControl() {
    this.f['fromDateMilady'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
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
          const taxType = this.taxTypes.find(type => this.form.get('taxTypeId')?.value === type.id)?.value || 1;
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

  calculateDifferentDates() {
    const rentTypeId = this.f['rentTypeId']?.value;
    const fromDate = this.f['fromDateMilady']?.value;
    const addedPeriodValue: number = +(this.f['rentPeriod'].value ?? 0);
    if (this.f['rentPeriod'].value === null) this.f['rentPeriod'].patchValue(1, { emitEvent: false });
    if (rentTypeId && this.rentValue != RentTypeEnum.HOUR && addedPeriodValue > 0 && fromDate) {
      const date = new Date(fromDate);
      const toDate = new Date(fromDate);
      if (this.rentValue === RentTypeEnum.DAY) toDate.setDate(+date.getDate() + addedPeriodValue);
      if (this.rentValue === RentTypeEnum.MONTH) toDate.setMonth(+date.getMonth() + addedPeriodValue);
      if (this.rentValue === RentTypeEnum.YEAR) toDate.setFullYear(+date.getFullYear() + addedPeriodValue);
      const endDate = this.datePipe.transform(toDate, 'MM/dd/YYYY');
      this.f['toDateMilady'].patchValue(endDate);
    }

    if (this.rentPriceValue) {
      this.f['rentAmount'].patchValue(this.rentPriceValue);
    }
  }

  processingRentDays() {
    if (this.rentValue == RentTypeEnum.HOUR) {
      this.f['rentPeriod'].patchValue(1, { emitEvent: false });
    }
  }
  //#endregion

  //#region Fetch
  fetchData() {
    // this.fetchRentProcedures('').subscribe((response: any) => (this.procedures = response.data));
    this.fetchRentTypesValues();
    this.fetchTaxTypesValues();
    this.getCompanyTaxValue();
  }

  fetchRentRequestDetails(rentRequestId: string) {
    this._rentService
      .infoRent(rentRequestId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: IResponse<IRent>) => {
          this.rentRequest = response.data;
          this.form.patchValue({
            rentAmount: this.rentRequest.rentAmount,
            rentAmountWithTax: this.rentRequest.rentAmountWithTax,
            rentAmountWithoutTax: this.rentRequest.rentAmountWithoutTax,
            rentPeriod: this.rentRequest.rentDaysPeriod,
            rentHoursPeriod: this.rentRequest.rentHoursPeriod,
            rentTypeId: this.rentRequest.rentTypeId,
            taxAmount: this.rentRequest.taxAmount,
            taxTypeId: this.rentRequest.taxTypeId,
          });
          this.getWorkerDetails(this.rentRequest.workerId);
        },
      });
  }

  fetchRentTypesValues() {
    this.fetchRentTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        // res.data.forEach(option => {
        //   if (option.value == 2) {
        //     option['value'] = 30;
        //   } else if (option.value == 3) {
        //     option['value'] = 1 / 24;
        //   } else if (option.value == 4) option['value'] = 365;
        // });
        this.rentTypes = res.data;
      });
  }

  getWorkerDetails(workerId: string) {
    this.rentPrice = null;
    this.workerServiceCh
      .infoWorker(workerId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IWorkerFormData>) => {
        this.getCountryRentSalePrices(response.data.countryId);
        this.monthlySalary = response.data.monthlySalary;
      });
  }

  getCompanyTaxValue() {
    this.getCompanyTax()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.companyTaxValue = res.data;
      });
  }

  getCountryRentSalePrices(countryId: string) {
    this._rentPriceService
      .getCountryRentPrices(countryId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.rentPrice = response.data;
        if (this.rentPrice) {
          this.rentPriceValue = this.rentPrice.prices.find(
            price => price?.rentType?.id == this.rentRequest?.rentTypeId
          )?.price;
          this.calculateWorkerSalary();
        }
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

  fetchTaxTypesValues() {
    this.fetchTaxTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.taxTypes = res.data;
      });
  }

  calculateWorkerSalary() {
    const retrieveDate = this.f['retrieveDate'].value;
    const contractDate = this.rentRequest?.fromDateMilady;
    if (retrieveDate && contractDate && this.rentPriceValue) {
      let days = this.helperService.daysDiff(new Date(contractDate), new Date(retrieveDate));
      this.f['workerSalary'].patchValue(days * this.rentPriceValue, { emitEvent: false });
    }
  }

  //#endregion

  // #region Actions
  submit() {
    const data = this.form.value;

    Object.keys(data).forEach(key => {
      if (data[key] === null) {
        delete data[key];
      }
    });

    if (this.form.valid) {
      this.loading = true;
      this._rentService
        .createRentProcedure(data)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this._router.navigate([`${AppRoutes.layout}/${AppRoutes.rents}/table`]);
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  fetchRequestProceduresSelect = () => {
    const requestId = this.form.get('rentRequestId')?.value;
    if (requestId)
      return this.fetchRentProcedures(requestId).pipe(
        tap(res => {
          this.procedures = res.data;
        })
      );
    else return of([]);
  };

  fetchCustomerRentRequestsSelect = (value?: string, page?: number) => {
    const customerId = this.form.get('customerId')?.value;
    if (customerId) return this.getCustomerRentRequestsSelect(customerId, value, page);
    else return of([]);
  };
  // #endregion
}
