import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEnum } from 'src/app/core/interfaces/enum.interface';
@Component({
  selector: 'app-work-data',
  templateUrl: './work-data.component.html',
  styleUrls: ['./work-data.component.scss'],
})
export class WorkDataComponent extends CoreBaseComponent {
  @Input() workDataGroup!: FormGroup;

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
