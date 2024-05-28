import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentService } from '../../services/rent.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { IRent, RentTypeEnum } from '../../models/rent.interface';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { RentPriceService } from 'src/app/modules/settings/services/rent-price.service';
import { IWorkerFormData } from 'src/app/modules/worker/models';
import { IRents } from 'src/app/modules/settings/models';
import { TimePipe } from 'src/app/core/pipes/time.pipe';

@UntilDestroy()
@Component({
  selector: 'app-rent-form',
  templateUrl: './rent-form.component.html',
  styleUrls: ['./rent-form.component.scss'],
  providers: [TimePipe, DatePipe],
})
export class RentFormComponent extends CoreBaseComponent implements OnInit {
  // #region Variables
  public form!: FormGroup;
  public loading: boolean = false;
  public loadingData: boolean = false;
  public isUpdated: boolean = false;
  public rentId!: string;
  public customers: IEnum[] = [];
  public workers: IEnum[] = [];
  public customerId!: string;
  public name!: string;
  public companyTaxValue!: number;
  public taxTypes!: IEnum[];
  public workerRentPrices!: IRents[] | null;
  public rentPriceValue!: number | undefined;
  public rentTypes!: IEnum[];
  public receivingTypes!: IEnum[];
  public editMode: boolean = false;
  //#endregion

  //#region  Accessors
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

  get receivingTypeValue(): number {
    const receivingTypeId = this.f['receivingTypeId']?.value;
    return (
      this.receivingTypes?.find(r => {
        return r.id === receivingTypeId;
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
  //  #endregion

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _rentService: RentService,
    private _activatedRoute: ActivatedRoute,
    public location: Location,
    private _fb: FormBuilder,
    private _router: Router,
    private _taxHandlerService: TaxHandlerService,
    private _rentPriceService: RentPriceService,
    public timePipe: TimePipe,
    public datePipe: DatePipe
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.rentId = this._activatedRoute.snapshot.params['id'];
    this.customerId = this._activatedRoute.snapshot.params['customerId'];
    this.name = this._activatedRoute.snapshot.params['name'];
    this.initialForm();
    this.getCompanyTaxValue();
    this.fetchTaxTypesValues();
    this.fetchRentTypesValues();
    this.fetchReceivingTypesValues();
    if (this.rentId) {
      this.isUpdated = true;
      this.fetchRentDetails(this.rentId);
    } else {
      this.isUpdated = false;
    }

    if (this.customerId && this.name) this.getCustomerDetails();
  }

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      //#region Basic Details
      requestDateMilady: [null, Validators.required],
      customerId: [null, Validators.required],
      workerId: [null, Validators.required],
      //#endregion

      //#region Period Details
      rentTypeId: [null, Validators.required],
      fromDateMilady: [null, Validators.nullValidator],
      toDateMilady: [null, Validators.nullValidator],
      rentDaysPeriod: [1, [Validators.nullValidator, Validators.min(1)]],
      rentHoursPeriod: [1, [Validators.nullValidator, Validators.min(1)]],
      //#endregion

      //#region Receiving Worker Details
      receivingTypeId: [null, Validators.required],
      receivingSuggestedTime: [null, Validators.required],
      receivingLocation: [null, Validators.nullValidator],
      receivingAddress: [null, Validators.nullValidator],
      receivingFees: [0, Validators.nullValidator],
      //#endregion

      //#region Finical Data
      rentAmount: [0, [Validators.required]],
      rentAmountWithTax: [0],
      rentAmountWithoutTax: [0],
      taxTypeId: [0, Validators.required],
      taxAmount: [0],
      totalAmountWithoutTax: [0],
      //#endregion
    });

    this.watchReceivingTypeControl();
    this.watchFromDateMiladyControl();
    this.watchDaysControl();
    this.watchHoursControl();
    this.watchRentTypeControl();
    this.calcRentValues();
  }

  watchReceivingTypeControl() {
    const array = ['receivingLocation', 'receivingAddress', 'receivingFees'];
    this.f['receivingTypeId'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.receivingTypeValue === 1 || this.receivingTypeValue == -1
        ? this.updateValidation(this.form, array, Validators.nullValidator)
        : this.updateValidation(this.form, array, Validators.required);
    });
  }

  watchFromDateMiladyControl() {
    this.f['fromDateMilady'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
  }

  watchDaysControl() {
    this.f['rentDaysPeriod'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
  }

  watchHoursControl() {
    this.f['rentHoursPeriod'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.calculateDifferentDates();
    });
  }

  watchRentTypeControl() {
    this.f['rentTypeId'].valueChanges.pipe(untilDestroyed(this)).subscribe(rentTypeId => {
      this.rentPriceValue = this.workerRentPrices?.find(price => price?.rentType?.id === rentTypeId)?.price;
      this.f['fromDateMilady'].setValue(null);
      this.f['toDateMilady'].setValue(null);
      this.f['rentDaysPeriod'].setValue(null);
      this.f['rentHoursPeriod'].setValue(null);
      this.calculateDifferentDates();
    });
  }

  getCustomerDetails() {
    const customer = { id: this.customerId, name: this.name };
    this.form.patchValue({
      customerId: customer,
    });
  }

  fillFormData(rent: IRent) {
    this.form.patchValue({
      requestDateMilady: rent.requestDateMilady,
      realEndDate: rent.realEndDate,
      customerId: rent.customer,
      workerId: rent.worker,
      requestStatusId: rent.requestStatus,
      rentTypeId: rent.rentType,

      fromDateMilady: rent.fromDateMilady,
      toDateMilady: rent.toDateMilady,

      receivingTypeId: rent.receivingType,
      receivingSuggestedTime: this.timePipe.transform(rent.receivingSuggestedTime, '12'),
      receivingAddress: rent.receivingAddress,
      receivingLocation: rent.receivingLocation,
      receivingFees: rent.receivingFees,

      rentDaysPeriod: rent.rentDaysPeriod,
      rentHoursPeriod: rent.rentHoursPeriod,

      rentAmountWithoutTax: rent.rentAmountWithoutTax,
      taxTypeId: rent.taxType,
      taxAmount: rent.taxAmount,
      rentAmountWithTax: rent.rentAmountWithTax,
      rentAmount: rent.rentAmount,
      financialStatusId: rent.financialStatus,
    });
  }
  // #endregion

  // #region Calculations
  calcRentValues() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      const rentAmount = +value['rentAmount'];
      if (rentAmount >= 0 && this.companyTaxValue >= 0 && this.companyTaxValue < 100) {
        if (this.f['rentHoursPeriod'].value == null) this.f['rentHoursPeriod'].patchValue(1, { emitEvent: false });
        if (this.f['rentDaysPeriod'].value == null) this.f['rentDaysPeriod'].patchValue(1, { emitEvent: false });

        const taxType = this.taxTypes.find(type => this.form.get('taxTypeId')?.value === type.id)?.value || 1;
        const taxAmount = this._taxHandlerService.calcTaxAmount(taxType, rentAmount, 0, +this.companyTaxValue);
        const withTaxAmount = taxType == 1 ? rentAmount : taxAmount + rentAmount;
        // const withoutTaxAmount = this._taxHandlerService.calcAmountWithoutTax(taxType, rentAmount, 0, taxAmount);
        let rentAmountTotalWithoutTaxAmount: number = -1;
        let rentAmountTotalWithTaxAmount: number = -1;

        if (this.rentValue === RentTypeEnum.HOUR) {
          rentAmountTotalWithoutTaxAmount = +(
            taxType == 1
              ? (rentAmount - taxAmount) * this.f['rentHoursPeriod'].value
              : rentAmount * this.f['rentHoursPeriod'].value
          ).toFixed(2);
          rentAmountTotalWithTaxAmount = +(withTaxAmount * this.f['rentHoursPeriod'].value).toFixed(2);
        } else {
          rentAmountTotalWithoutTaxAmount = +(
            taxType == 1
              ? (rentAmount - taxAmount) * this.f['rentDaysPeriod'].value
              : rentAmount * this.f['rentDaysPeriod'].value
          ).toFixed(2);
          rentAmountTotalWithTaxAmount = +(withTaxAmount * this.f['rentDaysPeriod'].value).toFixed(2);
        }

        this.form.patchValue(
          {
            taxAmount: taxAmount,
            rentAmountWithTax: rentAmountTotalWithTaxAmount,
            rentAmountWithoutTax: rentAmountTotalWithoutTaxAmount,
          },
          { emitEvent: false }
        );
      }
    });
  }

  calculateDifferentDates() {
    const rentTypeId = this.f['rentTypeId'].value;
    const fromDate: string = this.f['fromDateMilady'].value;
    const addedPeriodValue: number =
      this.rentValue === RentTypeEnum.HOUR ? +this.f['rentHoursPeriod'].value : +this.f['rentDaysPeriod'].value;
    if (this.f['rentDaysPeriod'].value === null) this.f['rentDaysPeriod'].patchValue(1, { emitEvent: false });
    if (this.f['rentHoursPeriod'].value === null) this.f['rentHoursPeriod'].patchValue(1, { emitEvent: false });
    if (rentTypeId && addedPeriodValue > 0 && fromDate) {
      const date = new Date(fromDate);
      const toDate = new Date(fromDate);
      if (
        this.rentValue === RentTypeEnum.DAY ||
        this.rentValue === RentTypeEnum.MONTH ||
        this.rentValue === RentTypeEnum.YEAR
      ) {
        // Day Rent
        if (this.rentValue === RentTypeEnum.DAY) toDate.setDate(date.getDate() + addedPeriodValue);
        // Month Rent
        if (this.rentValue === RentTypeEnum.MONTH) toDate.setMonth(date.getMonth() + addedPeriodValue);
        // Year Rent
        if (this.rentValue === RentTypeEnum.YEAR) toDate.setFullYear(date.getFullYear() + addedPeriodValue);
        if (toDate.toString() !== 'Invalid Date') {
          const endDate = this.datePipe.transform(toDate, 'MM/dd/YYYY');
          this.f['toDateMilady'].patchValue(endDate);
        }
      }
      // Hour Rent
      if (this.rentValue === RentTypeEnum.HOUR) {
        let endDate = '';
        if (+fromDate.split(':')[0] + addedPeriodValue >= 12 && +fromDate.split(':')[0] + addedPeriodValue <= 23) {
          endDate = `${(+fromDate.split(':')[0] + addedPeriodValue) % 24}:${fromDate.split(':')[1]}`;
        } else {
          endDate = `${(+fromDate.split(':')[0] + addedPeriodValue) % 12}:${fromDate.split(':')[1]}`;
        }
        this.f['toDateMilady'].patchValue(endDate);
      }
    }

    if (this.rentPriceValue) {
      this.f['rentAmount'].patchValue(this.rentPriceValue);
    }
  }

  calculateRentAmountWithoutTax = (value: number, period: number) => value * period;

  // #region Fetch
  getWorkerDetails(workerId: string) {
    this.workerRentPrices = null;
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
        this.workerRentPrices = response.data.prices;
        if (this.f['rentTypeId'].value && this.workerRentPrices) {
          this.rentPriceValue = this.workerRentPrices.find(
            price => price?.rentType?.id === this.f['rentTypeId'].value
          )?.price;
          this.f['rentAmount'].patchValue(this.rentPriceValue);
          this.f['rentAmountWithoutTax'].patchValue(
            this.calculateRentAmountWithoutTax(this.rentPriceValue ?? 0, this.f['rentDaysPeriod'].value ?? 1)
          );
        }
      });
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
    this.fetchRentTypes().subscribe(res => {
      this.rentTypes = res.data;
    });
  }

  fetchReceivingTypesValues() {
    this.fetchReceivingTypes().subscribe(res => {
      this.receivingTypes = res.data;
    });
  }

  fetchRentDetails(rentId: string) {
    this.loadingData = true;
    this._rentService
      .infoRent(rentId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IRent>) => {
        this.editMode = true;
        this.fillFormData(response.data as IRent);
        this.loadingData = false;
      });
  }
  // #endregion

  //  #region Actions
  submit(saveWithSendEmail = false, saveWithSendSms = false) {
    if (this.rentValue === RentTypeEnum.HOUR) delete this.form.value.rentDaysPeriod;
    else delete this.form.value.rentHoursPeriod;

    if (this.form.valid) {
      this.loading = true;
      let formDto: IRent = this.form.value;
      formDto.receivingSuggestedTime = this.helperService.convert12to24Hour(formDto.receivingSuggestedTime);

      //Type of Rent is Time
      if (this.rentValue === RentTypeEnum.HOUR) {
        const today: string = this.helperService.formatDate(new Date(), false);
        // Start Time
        const fromDateMiladyDate = new Date(today + ' ' + this.helperService.convert12to24Hour(formDto.fromDateMilady));
        formDto.fromDateMilady = fromDateMiladyDate.toISOString();
        // End Time
        const toDateMiladyDate = new Date(today + ' ' + this.helperService.convert12to24Hour(formDto.toDateMilady));
        formDto.toDateMilady = toDateMiladyDate.toISOString();
      }

      formDto.customerId = typeof formDto.customerId === 'object' ? formDto.customerId?.id : formDto.customerId;
      formDto.workerId = typeof formDto.workerId === 'object' ? formDto.workerId?.id : formDto.workerId;

      formDto.saveWithSendEmail = saveWithSendEmail;
      formDto.saveWithSendSms = saveWithSendSms;

      if (!this.isUpdated) {
        //Add
        this._rentService
          .createRent(formDto)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.loading = false))
          )
          .subscribe(res => {
            this._router.navigate([`${AppRoutes.layout}/${AppRoutes.rents}/table`]);
          });
      } else {
        //Update
        this._rentService
          .updateRent(this.rentId, formDto)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.loading = false))
          )
          .subscribe(res => {
            this._router.navigate([`${AppRoutes.layout}/${AppRoutes.rents}/table`]);
          });
      }
    }
  }
  // #endregion
}
