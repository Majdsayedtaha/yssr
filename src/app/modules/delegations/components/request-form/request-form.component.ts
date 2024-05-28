import { Component, OnInit, Injector, INJECTOR, Inject } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronicAuthService } from '../../services/delegations.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IEnum } from 'src/app/core/interfaces';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { mergeMap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'elect-auth-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class ElectFormRequestComponent extends CoreBaseComponent implements OnInit {
  requestForm!: FormGroup;
  requestId: string;
  skills: any = [];
  public companyTaxValue!: number;
  public taxTypes!: IEnum[];
  isLoading!: boolean;
  loadingData!: boolean;

  ngOnInit(): void {
    this.fetchTaxTypesValuesAndCompanyTax();
    // this.fetchTaxTypesValues();
  }

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _electAuthService: ElectronicAuthService,
    private _activatedRoute: ActivatedRoute,
    private _dialogService: DialogService,
    private _taxHandlerService: TaxHandlerService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
    this.requestId = this._activatedRoute.snapshot.params['id'];
    this.initForm();
    if (this.requestId) {
      this.loadingData = true;
      this._electAuthService.fetchRequestDetails(this.requestId).subscribe(res => {
        this.loadingData = false;
        if (res) {
          this.requestForm.patchValue({
            requestDateMilady: res.data.requestDateMilady,
            workersCount: res.data.workersCount,
            delegationOffice: res.data.delegationOffice,
            delegationNum: res.data.delegationNum,
            delegationDateMilady: res.data.delegationDateMilady,
            delegationStatusId: res.data.delegationStatus,
            musanedNumber: res.data.musanedNumber,
            musanedDateMilady: res.data.musanedDateMilady,
            sponsorshipTransferAmount: res.data.sponsorshipTransferAmount,
            sponsorshipTransferTaxAmount: res.data.sponsorshipTransferTaxAmount,
            note: res.data.note,
            customer: res.data.customer,
            worker: res.data.worker,
            jobId: res.data.job,
            countryId: res.data.country,
            taxTypeId: res.data.taxType,
          });
        }
      });
    }
  }

  initForm() {
    this.requestForm = this._fb.group({
      requestDateMilady: this._fb.control(null, Validators.required),
      workersCount: this._fb.control(0, Validators.required),
      delegationOffice: this._fb.control(null, Validators.required),
      delegationNum: this._fb.control(null, Validators.required),
      delegationDateMilady: this._fb.control(null, Validators.required),
      delegationStatusId: this._fb.control(null, Validators.required),
      musanedNumber: this._fb.control(null, Validators.required),
      musanedDateMilady: this._fb.control(null, Validators.required),
      sponsorshipTransferAmount: this._fb.control(0, [Validators.required, Validators.min(0)]),
      sponsorshipTransferTaxAmount: this._fb.control(0, [Validators.required, Validators.min(0)]),
      note: this._fb.control(null, [Validators.maxLength(250)]),
      customer: this._fb.control(null, Validators.required),
      worker: this._fb.control(null, Validators.required),
      jobId: this._fb.control(null, Validators.required),
      countryId: this._fb.control(null, Validators.required),
      taxTypeId: this._fb.control(null, Validators.required),
      taxNet: this._fb.control(0),
    });
  }

  fetchTaxTypesValuesAndCompanyTax() {
    return this.fetchTaxTypes()
      .pipe(
        untilDestroyed(this),
        mergeMap(taxTypes => {
          this.taxTypes = taxTypes.data;
          return this.getCompanyTax();
        })
      )
      .subscribe(res => {
        this.companyTaxValue = res.data;
        this.calcTaxAmount();
      });
  }

  calcTaxAmount() {
    this.requestForm.valueChanges.pipe(untilDestroyed(this)).subscribe(controlValue => {
      if (controlValue['taxTypeId'] && typeof +controlValue['sponsorshipTransferAmount'] === 'number') {
        const taxType =
          this.taxTypes.find(type => this.requestForm.get('taxTypeId')?.value?.id === type.id)?.value || 1;
        const taxAmount = this._taxHandlerService.calcTaxAmount(
          taxType,
          controlValue['sponsorshipTransferAmount'] || 0,
          0,
          this.companyTaxValue
        );
        this.requestForm.patchValue(
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

  submit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    let data = {
      ...this.requestForm.value,
      countryId: this.requestForm.value['countryId'].id,
      delegationStatusId: this.requestForm.value['delegationStatusId'].id,
      jobId: this.requestForm.value['jobId'].id,
      taxTypeId: this.requestForm.value['taxTypeId'].id,
      customer: this.requestForm.value['customer'],
      worker: this.requestForm.value['worker'],
    };
    this.isLoading = true;
    if (!this.requestId) {
      this._electAuthService.createRequest(data).subscribe({
        next: res => {
          this.isLoading = false;
          this._dialogService
            .successNotify('success_request', 'success-request', 'add-new-request', 'back_to_request_table', false)
            .subscribe(r => {
              if (r === true) {
                this.cancel();
              } else {
                this.requestForm.reset();
                this._router.navigate(['delegations/add-request']);
              }
            });
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this._electAuthService.updateRequest(data, this.requestId).subscribe({
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
    this._router.navigate(['delegations/table']);
  }
}
