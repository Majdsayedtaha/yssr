import { of } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit, Injector, INJECTOR, Inject } from '@angular/core';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { SuretyTransferService } from '../../services/surety-transfer.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@UntilDestroy()
@Component({
  selector: 'surety-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent extends CoreBaseComponent implements OnInit {
  public orderForm!: FormGroup;
  public waiverRequestId: string;
  public companyTaxValue!: number;
  public taxTypes!: IEnum[];
  public name!: string;
  public customerId!: string;
  isLoading!: boolean;
  loadingData!: boolean;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _suretyTransferService: SuretyTransferService,
    private _activatedRoute: ActivatedRoute,
    private _dialogService: DialogService,
    private _taxHandlerService: TaxHandlerService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
    this.waiverRequestId = this._activatedRoute.snapshot.params['id'];
    this.customerId = this._activatedRoute.snapshot.params['customerId'];
    this.name = this._activatedRoute.snapshot.params['name'];
    this.initForm();
    if (this.waiverRequestId) {
      this.loadingData = true;
      this._suretyTransferService.fetchOrderInfo(this.waiverRequestId).subscribe(res => {
        this.loadingData = false;
        if (res)
          this.orderForm.patchValue({
            requestDateMilady: res.data.requestDateMilady,
            worker: res.data.worker,
            customer: res.data.customer,
            taxType: res.data.taxType,
            // taxAmount: res.data.taxAmount,
            transferAmount: res.data.transferAmount,
            sponsorshipTransferType: res.data.sponsorshipTransferType,
            oldSponsor: res.data.worker.name,
            newSponsor: res.data.newSponsor,
            sponsorshipTransferAmount: res.data.sponsorshipTransferAmount,
            sponsorshipTransferTaxAmount: res.data.sponsorshipTransferTaxAmount,
            note: res.data.note,
            request: res.data.request,
          });
      });
    }
    if (this.customerId && this.name) this.getCustomerDetails();
  }

  ngOnInit(): void {
    this.getCompanyTaxValue();
    this.fetchTaxTypesValues();
    this.calcTaxAmount();
    this.orderForm.get('request')?.valueChanges.subscribe(res => {
      if (res) {
        this._suretyTransferService
          .getOldSponsor(
            this.orderForm.get('request')?.value.id,
            this.orderForm.get('sponsorshipTransferType')?.value.id
          )
          .subscribe(res => {
            this.orderForm.patchValue({
              oldSponsor: res.data,
            });
          });
      }
    });
  }

  initForm() {
    this.orderForm = this._fb.group({
      requestDateMilady: [null, [Validators.required]],
      sponsorshipTransferType: [null, [Validators.required]],
      newSponsor: [null, [Validators.required]],
      sponsorshipTransferAmount: [0, [Validators.min(0), Validators.required]],
      note: [null, [Validators.maxLength(250)]],
      sponsorshipTransferTaxAmount: [0, [Validators.min(0)]],
      taxType: [null, [Validators.required]],
      request: [null, [Validators.required]],
      oldSponsor: [null],
      taxNet: [0],
    });
  }

  fetchTaxTypesValues() {
    this.fetchTaxTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.taxTypes = res.data;
        this.calcTaxAmount();
      });
  }

  getCustomerDetails() {
    const customer = { id: this.customerId, name: this.name };
    this.orderForm.patchValue({
      customer: customer,
    });
  }

  getCompanyTaxValue() {
    this.getCompanyTax()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.companyTaxValue = res.data;
      });
  }

  calcTaxAmount() {
    this.orderForm.valueChanges.pipe(untilDestroyed(this)).subscribe(controlValue => {
      if (controlValue['taxType'] && controlValue['sponsorshipTransferAmount'] >= 0) {
        const taxType = this.taxTypes.find(type => this.orderForm.get('taxType')?.value.id === type.id)?.value || 1;
        const taxAmount = this._taxHandlerService.calcTaxAmount(
          taxType,
          controlValue['sponsorshipTransferAmount'],
          0,
          this.companyTaxValue
        );
        this.orderForm.patchValue(
          {
            sponsorshipTransferTaxAmount: taxAmount,
            taxNet: this._taxHandlerService.calcTotalWithTax(
              controlValue['sponsorshipTransferAmount'],
              0,
              taxAmount,
              0
            ),
          },
          { emitEvent: false }
        );
      }
    });
  }

  fetchNumbersByType = (value?: string, page?: number) => {
    if (this.orderForm.get('sponsorshipTransferType')?.value)
      return this._suretyTransferService.fetchNumbersByType(this.orderForm.get('sponsorshipTransferType')?.value?.id, {
        query: value || '',
        page: typeof page == 'number' ? page.toString() : '',
      });
    else return of([]);
  };

  submit() {
    this.isLoading = true;
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    let data = { ...this.orderForm.value };
    if (!this.waiverRequestId) {
      this._suretyTransferService.createSponsorshipTransferRequest(data).subscribe({
        next: res => {
          this.isLoading = false;
          this._dialogService
            .successNotify('success_request', 'success-request', 'add-new-request', 'back_to_request_table', false)
            .subscribe(r => {
              if (r === true) {
                this.cancel();
              } else {
                this.orderForm.reset();
                this._router.navigate(['surety-transfers/add-order']);
              }
            });
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this._suretyTransferService.updateRequest(data, this.waiverRequestId).subscribe({
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
    this._router.navigate(['surety-transfers/completed-orders']);
  }
}
