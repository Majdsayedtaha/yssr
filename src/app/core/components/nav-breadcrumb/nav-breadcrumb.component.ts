import { Observable } from 'rxjs';
import { IBreadcrumb } from '../../models';
import { CoreBaseComponent } from '../base/base.component';
import { BreadcrumbsService } from '../../services/breadcrumb.service';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  INJECTOR,
  Inject,
  Injector,
} from '@angular/core';

@Component({
  selector: 'nav-breadcrumb',
  templateUrl: './nav-breadcrumb.component.html',
  styleUrls: ['./nav-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBreadCrumbComponent extends CoreBaseComponent implements OnInit {
  @Input('child') child: string | null = null;
  public breadcrumbs$!: Observable<IBreadcrumb[]>;

  constructor(
    public _breadcrumbService: BreadcrumbsService,
    @Inject(INJECTOR) injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.breadcrumbs$ = this._breadcrumbService.breadcrumbs$;
  }
}
