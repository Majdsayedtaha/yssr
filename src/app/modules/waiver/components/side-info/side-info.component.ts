import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IWaiverRequest } from '../../models';
import { WaiverService } from '../../services/waiver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'waiver-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss'],
})
export class SideInfoWaiverComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  waiverData?: IWaiverRequest;
  isLoading = false;
  waiverId!: string;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _waiverService: WaiverService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._waiverService.waiverRequestId
      .pipe(
        untilDestroyed(this),
        tap(res => {
          this.sidenav.open();
          this.isLoading = true;
        }),
        switchMap(res => {
          if (res) {
            this.waiverId = res;
            return this._waiverService.fetchWaiverRequestDetails(this.waiverId);
          } else return of(null);
        })
      )
      .subscribe({
        next: waiverRequest => {
          this.isLoading = false;
          if (waiverRequest) {
            this.waiverData = waiverRequest.data;
            this.calculateNetTax();
          }
        },
        error: err => {
          this.isLoading = false;
        },
      });
  }

  calculateNetTax() {
    if (this.waiverData) {
      this._waiverService
        .getRequestTotalTax(this.waiverId, {
          taxType: this.waiverData.taxType,
          tax: this.waiverData.taxAmount,
          amount: this.waiverData.transferAmount,
        })
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }

  closeSideNav() {
    this._waiverService.waiverRequestId.next(null);
    this.sidenav.close();
  }

  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
