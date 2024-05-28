import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { of } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'app-external-offices-data',
  templateUrl: './external-offices-data.component.html',
  styleUrls: ['./external-offices-data.component.scss'],
})
export class ExternalOfficesDataComponent extends CoreBaseComponent {
  @Input() externalOfficeData!: FormGroup;

  skills: IEnum[] = [];

  get countryIdValue() {
    let form: FormGroup = this.externalOfficeData.parent as FormGroup;
    let contractForm = form?.get('contractData') as FormGroup
    return contractForm.controls['countryId'].value;
  }

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSkillsCheckboxOptions();
  }

  getSkillsCheckboxOptions() {
    this.fetchSkills().subscribe(res => {
      this.skills = res.data;
    });
  }

  fetchRepresentativesSelect = (value?: string, page?: number) => {
    const id = this.externalOfficeData?.get('externalOfficeId')?.value;
    if (!id) {
      this.updateValidation(this.externalOfficeData, ['representativeId'], Validators.nullValidator);
      return of('');
    }
    this.updateValidation(this.externalOfficeData, ['representativeId'], Validators.required);
    return this.getRepresentativesSelect(id, value, page);
  };
}
