import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IBenefit } from '../../models';
import { WorkerBenefitsService } from '../../services/worker-benefits.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'worker-benefits-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss'],
})
export class SideInfoBenefitsComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  requestData?: IBenefit;
  isLoading = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _workerBenefitsService: WorkerBenefitsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._workerBenefitsService.requestId
      .pipe(
        untilDestroyed(this),
        tap(res => {
          this.sidenav.open();
          this.isLoading = true;
        }),
        switchMap(res => {
          if (res) return this._workerBenefitsService.fetchBenefitDetails(res);
          else return of(null);
        })
      )
      .subscribe({
        next: request => {
          this.isLoading = false;
          if (request) this.requestData = request.data;
        },
        error: err => {
          this.isLoading = false;
        },
      });
  }

  closeSideNav() {
    this._workerBenefitsService.requestId.next(null);
    this.sidenav.close();
  }

  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
