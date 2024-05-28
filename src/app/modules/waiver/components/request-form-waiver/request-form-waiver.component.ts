import { Component, OnInit, Injector, INJECTOR, Inject } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WaiverService } from '../../services/waiver.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { IEnum } from 'src/app/core/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { NumberLengthNumberValidator } from 'src/app/core/validators/onlyNumber';
@UntilDestroy()
@Component({
  selector: 'waiver-request-form',
  templateUrl: './request-form-waiver.component.html',
  styleUrls: ['./request-form-waiver.component.scss'],
})
export class WaiverFormRequestWaiverComponent extends CoreBaseComponent implements OnInit {
  public withTax = false;
  public taxTypes!: IEnum[];
  public isLoading!: boolean;
  public orderForm!: FormGroup;
  public loadingData!: boolean;
  public waiverRequestId!: string;
  public companyTaxValue!: number;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _waiverService: WaiverService,
    private _activatedRoute: ActivatedRoute,
    private _dialogService: DialogService,
    private _taxHandlerService: TaxHandlerService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchData();
    this.calcTaxAmount();
    this.watchTaxChanges();
    this.watchRouteChanges();
  }

  watchRouteChanges() {
    this._activatedRoute.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
      this.waiverRequestId = params['id'];
      if (this.waiverRequestId) this.fetchWaiverRequestInfo(this.waiverRequestId);
    });
  }

  initForm() {
    this.orderForm = this._fb.group({
      requestDate: this._fb.control(null, Validators.required),
      workerId: this._fb.control(null, Validators.required),
      customerId: this._fb.control(null, Validators.required),
      taxTypeId: this._fb.control(null, Validators.required),
      visaNumber: [null, [Validators.required, NumberLengthNumberValidator.number()]],
      arrivalDate: [null, [Validators.required]],
      transferAmount: this._fb.control(0, [Validators.min(0), Validators.required]),
      taxAmount: this._fb.control(0, [Validators.min(0)]),
      taxNet: this._fb.control(0, [Validators.min(0)]),
      withTax: [false, [Validators.required]],
      note: this._fb.control(null, [Validators.maxLength(250)]),
    });
  }

  watchTaxChanges() {
    this.orderForm.get('withTax')?.valueChanges.subscribe(value => {
      if (!value) {
        this.withTax = false;
        this.orderForm.get('taxTypeId')?.removeValidators(Validators.required);
        this.orderForm.get('taxTypeId')?.reset();
        this.orderForm.get('taxTypeId')?.updateValueAndValidity();
      } else {
        this.withTax = true;
        this.orderForm.get('taxTypeId')?.setValidators(Validators.required);
        this.orderForm.get('taxTypeId')?.reset();
        this.orderForm.get('taxTypeId')?.updateValueAndValidity();
      }
    });
  }

  fetchData() {
    this.getCompanyTaxValue();
    this.fetchTaxTypesValues();
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

  fetchWaiverRequestInfo(waiverRequestId: string) {
    this.loadingData = true;
    this._waiverService.fetchWaiverRequestDetails(waiverRequestId).subscribe(res => {
      this.loadingData = false;
      if (res) {
        this.orderForm.patchValue({
          requestDate: res.data.requestDate,
          visaNumber: res.data.visaNumber,
          arrivalDate: res.data.arrivalDate,
          workerId: res.data.worker,
          customerId: res.data.customer,
          taxTypeId: res.data.taxType,
          taxAmount: res.data.taxAmount,
          taxNet: res.data.transferAmount + res.data.taxAmount,
          transferAmount: res.data.transferAmount,
          note: res.data.note,
        });
        this.withTax = res.data.taxType != null;
        this.orderForm.get('withTax')?.patchValue(this.withTax, { emitEvent: false });
      }
    });
  }

  calcTaxAmount() {
    this.orderForm.valueChanges.pipe(untilDestroyed(this)).subscribe(controlValue => {
      if (controlValue['taxTypeId'] && controlValue['transferAmount'] >= 0) {
        const taxType = this.taxTypes.find(type => this.orderForm.get('taxTypeId')?.value === type.id)?.value || 1;
        const taxAmount = this._taxHandlerService.calcTaxAmount(
          taxType,
          controlValue['transferAmount'],
          0,
          this.companyTaxValue
        );

        this.orderForm.patchValue(
          {
            taxAmount: taxAmount,
            taxNet: this._taxHandlerService.calcTotalWithTax(controlValue['transferAmount'], 0, taxAmount, 0),
          },
          { emitEvent: false }
        );
      }
    });
  }

  fetchCustomerWorkers = () => {
    return this._waiverService.fetchWorkers();
  };

  submit() {
    this.isLoading = true;
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    let data = { ...this.orderForm.value };
    if (!this.waiverRequestId) {
      this._waiverService.createWaiverRequest(data).subscribe({
        next: res => {
          this.isLoading = false;
          this._dialogService
            .successNotify('success_request', 'success-request', 'add-new-request', 'back_to_request_table', false)
            .subscribe(r => {
              if (r === true) {
                this.cancel();
              } else {
                this.orderForm.reset();
                this._router.navigate(['waivers/add-request-waiver']);
              }
            });
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      data = {
        ...data,
        workerId: this.orderForm.value['workerId'],
        customerId: this.orderForm.value['customerId'],
      };
      this._waiverService.updateWaiverRequest(data, this.waiverRequestId).subscribe({
        next: res => {
          this.isLoading = false;

          this.cancel();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  cancel() {
    this._router.navigate(['waivers/table']);
  }
}
