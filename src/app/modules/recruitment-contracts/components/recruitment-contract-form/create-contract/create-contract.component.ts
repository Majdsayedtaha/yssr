import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces';
import { AgreementPriceService } from 'src/app/modules/offices/services/agreement-price.service';
import { SalePriceService } from 'src/app/modules/settings/services/sale-price.service';
import { RecruitmentContractFormComponent } from '../recruitment-contract-form.component';
interface IOffice {
  religionId: string;
  jobId: string;
  experienceTypeId: string;
  countryId?: string;
  externalOfficeId?: string | IEnum;
}
@UntilDestroy()
@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
})
export class CreateContractComponent extends CoreBaseComponent {
  @Input() contractData!: FormGroup;
  @Input() contractId!: string;
  apiForm!: IOffice;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _salePriceService: SalePriceService,
    private _agreementPriceService: AgreementPriceService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.catchContractData();
    this.catchExternalOfficeChange();
  }

  catchContractData() {
    this.contractData.controls['religionId'].valueChanges.pipe(untilDestroyed(this)).subscribe((id: string) => {
      this.contractData.controls['religionId'].patchValue(id, { emitEvent: false });
      this.checkToFetch();
    });
    this.contractData.controls['jobId'].valueChanges.pipe(untilDestroyed(this)).subscribe((id: string) => {
      this.contractData.controls['jobId'].patchValue(id, { emitEvent: false });
      this.checkToFetch();
    });
    this.contractData.controls['experienceTypeId'].valueChanges.pipe(untilDestroyed(this)).subscribe((id: string) => {
      this.contractData.controls['experienceTypeId'].patchValue(id, { emitEvent: false });
      this.checkToFetch();
    });
    this.contractData.controls['countryId'].valueChanges.pipe(untilDestroyed(this)).subscribe((id: string) => {
      this.contractData.controls['countryId'].patchValue(id, { emitEvent: false });
      this.checkToFetch();
    });

    this.contractData.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if (value.religionId && value.jobId && value.experienceTypeId && value.countryId) {
        this.apiForm = {
          religionId: value.religionId,
          jobId: value.jobId,
          experienceTypeId: value.experienceTypeId,
          countryId: value.countryId,
        };
      }
    });
  }

  checkToFetch() {
    const form = this.contractData.value;
    this.apiForm = {
      religionId: form.religionId,
      jobId: form.jobId,
      experienceTypeId: form.experienceTypeId,
      countryId: form.countryId,
    };
    if (this.apiForm.countryId && this.apiForm.experienceTypeId && this.apiForm.religionId && this.apiForm.jobId) {
      this.getRecruitmentSalaryValue(this.apiForm);
    }
  }

  catchExternalOfficeChange() {
    this.contractData.parent
      ?.get('externalOfficeData')
      ?.get('externalOfficeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.getAgreementValue(value);
      });
  }

  getRecruitmentSalaryValue(value: IOffice) {
    this._salePriceService
      .getRecruitmentSalary({
        religionId: value.religionId,
        jobId: value.jobId,
        experienceTypeId: value.experienceTypeId,
        countryId: typeof value.countryId === 'object' ? (value.countryId as IEnum).id : value.countryId,
      })
      .subscribe((res: any) => {
        if (!this.contractId)
          this.contractData.parent
            ?.get('financialData')
            ?.get('contractAmount')
            ?.setValue(res.data ?? 0);
      });
  }

  getAgreementValue(externalOfficeId: any) {
    if (externalOfficeId && this.apiForm?.experienceTypeId && this.apiForm?.jobId && this.apiForm?.religionId) {
      this._agreementPriceService
        .getAgreementPrice({
          religionId: this.apiForm.religionId,
          jobId: this.apiForm.jobId,
          experienceTypeId: this.apiForm.experienceTypeId,
          externalOfficeId: externalOfficeId?.id || externalOfficeId,
        })
        .subscribe((res: any) => {
          this.contractData.parent
            ?.get('externalOfficeData')
            ?.get('externalOfficeAmount')
            ?.setValue(res.data?.['agreementPrice'] ?? 0);
        });
    }
  }
}
