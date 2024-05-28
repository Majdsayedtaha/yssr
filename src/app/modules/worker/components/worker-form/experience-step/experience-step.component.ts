import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'experience-step',
  templateUrl: './experience-step.component.html',
  styleUrls: ['./experience-step.component.scss']
})
export class ExperienceStepComponent extends CoreBaseComponent {

  //#region Variables
  //Decorators
  @Input() form!: FormGroup;
  //#endregion

  get countryIdValue() {
    let form: FormGroup = this.form.parent as FormGroup;
    let personalFrom = form?.get('personalFrom') as FormGroup
    return personalFrom?.controls['CountryId'].value;
  }

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

}
