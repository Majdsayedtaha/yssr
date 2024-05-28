import { Component, INJECTOR, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';

@UntilDestroy()
@Component({
  selector: 'personal-step',
  templateUrl: './personal-step.component.html',
  styleUrls: ['./personal-step.component.scss'],
})
export class PersonalStepComponent extends CoreBaseComponent implements OnInit {
  @Input() form!: FormGroup;
  public genderList: IEnum[] = [];
  public cvTypes: IEnum[] = [];

  get cvTypeValue(): number {
    let cvTypeId = this.form?.get('CVTypeId')?.value;
    cvTypeId = cvTypeId && typeof cvTypeId == 'object' ? (cvTypeId as IEnum).id : cvTypeId;
    return this.cvTypes?.find(r => r.id === cvTypeId)?.value as number;
  }

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  //#region LifeCycle
  ngOnInit(): void {
    this.fetchData();
    this.fetchCVTypes()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.cvTypes = response.data));
    this.watchCvTypeChangesControl();
  }
  //#endregion

  watchCvTypeChangesControl() {
    this.form
      .get('CVTypeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.form.controls['cvTypeCheckedData'].patchValue(true);
      });
  }

  //#region Fetch
  fetchData() {
    this.fetchGenders();
  }

  fetchGenders() {
    this.getGenderListData()
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IEnum[]>) => (this.genderList = response.data));
  }
  //#endregion
}
