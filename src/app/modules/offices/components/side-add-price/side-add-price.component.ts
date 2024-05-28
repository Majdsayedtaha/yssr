import { finalize } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { IAgreementPriceForm } from '../../models';
import { MatSidenav } from '@angular/material/sidenav';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AgreementPriceService } from '../../services/agreement-price.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ExternalOfficesService } from '../../services/external-office.service';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';

@UntilDestroy()
@Component({
  selector: 'side-add-price',
  templateUrl: './side-add-price.component.html',
  styleUrls: ['./side-add-price.component.scss'],
})
export class SideAddPriceComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  externalOfficePriceForm!: FormGroup;
  isLoading: boolean = false;
  loadingFetchingPrices: boolean = false;
  prices: any[] = [];
  selectedExternalOfficeId!: string;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _agreementPriceService: AgreementPriceService,
    public externalOfficesService: ExternalOfficesService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
    this.watchFormChanges();
    this.checkIfNeedToOpen();
  }

  initialForm() {
    this.externalOfficePriceForm = this._fb.group({
      externalOfficeId: [null, Validators.required],
      jobId: [null, Validators.required],
      experienceTypeId: [null],
      religionId: [null, Validators.required],
      agreementPrice: [null, Validators.required],
      recruitmentPeriod: [null],
    });
  }

  watchFormChanges() {
    this.watchJobControl();
    this.watchReligionControl();
    this.watchExperienceTypeControl();
  }

  checkIfNeedToOpen() {
    this.externalOfficesService.sideAddPrice.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.externalOfficePriceForm.reset();
        this.externalOfficePriceForm.controls['externalOfficeId'].patchValue(data.office);
        this.selectedExternalOfficeId = data.office.id as string;
        this.fetchPrices(data.office.id as string);
        this.isLoading = false;
        this.sidenav.open();
      }
    });
  }

  watchJobControl() {
    this.externalOfficePriceForm.controls['jobId'].valueChanges.pipe(untilDestroyed(this)).subscribe(jobId => {
      if (jobId) {
        this.externalOfficePriceForm.controls['jobId'].patchValue(jobId, { emitEvent: false });
        if (this.canBeFetched()) this.fetchAgreementPrice();
      }
    });
  }

  watchExperienceTypeControl() {
    this.externalOfficePriceForm.controls['experienceTypeId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(experienceTypeId => {
        if (experienceTypeId) {
          this.externalOfficePriceForm.controls['experienceTypeId'].patchValue(experienceTypeId, { emitEvent: false });
          if (this.canBeFetched()) this.fetchAgreementPrice();
        }
      });
  }

  watchReligionControl() {
    this.externalOfficePriceForm.controls['religionId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(religionId => {
        if (religionId) {
          this.externalOfficePriceForm.controls['religionId'].patchValue(religionId, { emitEvent: false });
          if (this.canBeFetched()) this.fetchAgreementPrice();
        }
      });
  }

  fetchPrices(externalOfficeId: string) {
    this._agreementPriceService
      .getAgreementPrices(externalOfficeId)
      .pipe(untilDestroyed(this))
      .subscribe(
        response =>
          (this.prices = response.data.map((el: IAgreementPriceForm) => {
            return {
              experienceTypeId: el.experienceTypeId,
              jobId: el.jobId,
              externalOfficeId: el.externalOfficeId,
              agreementPrice: el.agreementPrice,
              recruitmentPeriod: el.recruitmentPeriod,
              religionId: el.religionId,
            } as IAgreementPriceForm;
          }))
      );
  }

  canBeFetched = (): boolean => {
    const agreement: IAgreementPriceForm = this.externalOfficePriceForm.value;

    return (
      this.selectedExternalOfficeId != null &&
      agreement.experienceTypeId != null &&
      agreement.religionId != null &&
      agreement.jobId != null
    );
  };

  fetchAgreementPrice() {
    const agreementData: IAgreementPriceForm = this.externalOfficePriceForm.value;
    agreementData.externalOfficeId = this.selectedExternalOfficeId;
    this.loadingFetchingPrices = true;
    this.externalOfficePriceForm.controls['agreementPrice'].disable();
    this.externalOfficePriceForm.controls['recruitmentPeriod'].disable();
    this._agreementPriceService
      .getAgreementPrice(agreementData)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.loadingFetchingPrices = false))
      )
      .subscribe((response: IResponse<IAgreementPriceForm>) => {
        let agreement = response.data;
        if (agreement != null) {
          this.externalOfficePriceForm.patchValue({
            agreementPrice: agreement.agreementPrice ?? 0,
            recruitmentPeriod: agreement.recruitmentPeriod ?? 0,
          });
        } else {
          this.externalOfficePriceForm.patchValue({
            agreementPrice: 0,
            recruitmentPeriod: 0,
          });
        }
      });
  }

  addAgreementPrice() {
    this.isLoading = true;
    const tempPrices: IAgreementPriceForm[] = [...this.prices];
    tempPrices.push({ ...this.externalOfficePriceForm.value, externalOfficeId: this.selectedExternalOfficeId });
    const formDto = {
      externalOfficeId: this.selectedExternalOfficeId,
      prices: tempPrices,
    };
    this._agreementPriceService.addAgreementPrice(formDto).subscribe(res => {
      this.isLoading = false;
      this.externalOfficePriceForm.reset();
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.externalOfficesService.sideAddPrice.next(null);
  }
}
