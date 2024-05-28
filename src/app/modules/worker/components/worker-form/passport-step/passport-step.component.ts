import { Component, INJECTOR, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'passport-step',
  templateUrl: './passport-step.component.html',
  styleUrls: ['./passport-step.component.scss'],
})
export class PassportStepComponent extends CoreBaseComponent implements OnInit {
  @Input() form!: FormGroup;

  public iqamaControls = ['IqamaNumber', 'IqamaPlaceOfIssue', 'IqamaStartDate', 'IqamaExpireDate', 'BorderNumber'];
  public workerLicenseControls = ['WorkLicenseStartDate', 'WorkLicenseExpireDate'];
  public insuranceControls = [
    'InsuranceCompany',
    'InsuranceCategory',
    'InsuranceStartDate',
    'InsuranceExpireDate',
    'PolicyNumber',
  ];
  public cvTypes: IEnum[] = [];
  public RECRUITMENT = 1;
  public TRANSFER = 2;
  public resetDateFormGroup: boolean = false;

  public haveData: boolean = true;

  get cvTypeValue(): number {
    let cvTypeId = this.form?.parent?.get('personalFrom')?.get('CVTypeId')?.value;
    cvTypeId = cvTypeId && typeof cvTypeId == 'object' ? (cvTypeId as IEnum).id : cvTypeId;
    return this.cvTypes?.find(r => r.id === cvTypeId)?.value as number;
  }

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchCVTypes()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.cvTypes = response.data));
    this.checkOnCvTypeValue();
    this.watchCvTypeCheckboxChangesControl();
  }

  checkOnCvTypeValue() {
    const personalFrom = this.form?.parent?.get('personalFrom');
    if (personalFrom) {
      const cvTypeIdControl = personalFrom.get('CVTypeId');
      if (cvTypeIdControl) {
        const controlChanges = [...this.insuranceControls, ...this.iqamaControls, ...this.workerLicenseControls];
        cvTypeIdControl.valueChanges.pipe(untilDestroyed(this)).subscribe(cvType => {
          controlChanges.forEach(controlName => this.form.controls[controlName]?.reset());
          if (
            this.cvTypeValue === this.RECRUITMENT ||
            (cvType && typeof cvType == 'object' && cvType.value === this.RECRUITMENT)
          ) {
            this.handleFormControls([...this.iqamaControls, ...this.workerLicenseControls], 'delete');
          } else {
            this.handleFormControls([...this.iqamaControls, ...this.workerLicenseControls], 'add');
            this.updateValidation(
              this.form,
              [...this.iqamaControls, ...this.workerLicenseControls],
              this.cvTypeValue == 3 || this.cvTypeValue == 4 ? Validators.nullValidator : Validators.required
            );
          }
        });
      }
    }
  }

  watchCvTypeCheckboxChangesControl() {
    const personalFrom = this.form?.parent?.get('personalFrom');
    const controlChanges = [...this.insuranceControls, ...this.iqamaControls, ...this.workerLicenseControls];
    if (personalFrom) {
      const cvCheckDataControl = personalFrom.get('cvTypeCheckedData');
      if (cvCheckDataControl) {
        cvCheckDataControl.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
          this.haveData = value;
          controlChanges.forEach(controlName => this.form.controls[controlName]?.reset());

          if (value) {
            this.resetDateFormGroup = false;
            this.handleFormControls(controlChanges, 'add');
            // this.updateValidation(this.form, controlChanges, Validators.required); //TODO Fix Validation FormDate First
          } else {
            this.resetDateFormGroup = true;
            this.handleFormControls(controlChanges, 'delete');
            // this.updateValidation(this.form, controlChanges, Validators.nullValidator); //TODO Fix Validation FormDate First
          }
        });
      }
    }
  }

  handleFormControls(controlNames: string[], type: 'add' | 'delete') {
    controlNames.forEach(name => {
      const control = this.form.get(name);
      if (type === 'delete') {
        if (control) {
          this.form.removeControl(name);
        }
      } else {
        if (control == undefined || control == null) {
          this.form.addControl(name, this._fb.control(null, Validators.required));
        }
      }
    });
    this.form.updateValueAndValidity();
  }

  handleValidatorsAndValidity(controlNames: string[], type: 'add' | 'delete') {
    controlNames.forEach(name => {
      const control = this.form?.get(name);
      if (control) {
        type === 'add'
          ? control.addValidators(Validators.required)
          : type === 'delete'
          ? control.removeValidators(Validators.required)
          : '';
        control.updateValueAndValidity();
      }
    });
  }
}
