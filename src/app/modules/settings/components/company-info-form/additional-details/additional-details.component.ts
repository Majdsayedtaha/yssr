import { Component, Input, Injector, INJECTOR, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss'],
})
export class AdditionalDetailsComponent extends CoreBaseComponent {
  @Input() additionalDetailsGroup!: FormGroup;
  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }
}
