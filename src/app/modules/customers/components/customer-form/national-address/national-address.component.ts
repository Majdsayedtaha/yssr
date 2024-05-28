import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'app-national-address',
  templateUrl: './national-address.component.html',
  styleUrls: ['./national-address.component.scss'],
})
export class NationalAddressComponent extends CoreBaseComponent {
  @Input() nationalAddressGroup!: FormGroup;

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.onChangeRegion();
  }

  onChangeRegion() {
    this.nationalAddressGroup
      .get('regionId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.nationalAddressGroup.get('cityId')?.reset(null);
      });
  }

  getRegionCitiesSettings = (value?: string, page?: number) => {
    const regId = this.nationalAddressGroup.get('regionId')?.value;
    if (regId) return this.getRegionCities(regId, value, page);
    else return of([]);
  };
}
