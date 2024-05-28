import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent extends CoreBaseComponent {

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }
}
