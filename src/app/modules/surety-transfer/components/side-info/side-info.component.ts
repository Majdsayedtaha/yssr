import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ISuretyRequest } from '../../models';
import { SuretyTransferService } from '../../services/surety-transfer.service';
import { of, switchMap, tap, Subscription } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'surety-transfer-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss'],
})
export class SideInfoSuretyComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  sub?: Subscription;
  data?: ISuretyRequest;
  isLoading = false;
  id!: string;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _suretyTransferService: SuretyTransferService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.sub = this._suretyTransferService.orderId
      .pipe(
        untilDestroyed(this),
        tap(res => {
          this.sidenav.open();
          this.isLoading = true;
        }),
        switchMap(res => {
          if (res) {
            this.id = res;
            return this._suretyTransferService.fetchOrderInfo(res);
          }
          else return of(null);
        })
      )
      .subscribe({
        next: request => {
          this.isLoading = false;
          if (request) {
            this.data = request.data;
            this.calculateNetTax();
          }
        },
        error: err => {
          this.isLoading = false;
        },
      });
  }

  calculateNetTax() {
    if (this.data) {
      this._suretyTransferService.getRequestTotalTax(this.id, {
        taxType: this.data.taxType?.id,
        tax: this.data.sponsorshipTransferTaxAmount,
        amount: this.data.sponsorshipTransferAmount
      }).pipe(untilDestroyed(this)).subscribe(response => {

      });
    }
  }

  closeSideNav() {
    this._suretyTransferService.orderId.next(null);
    this.sidenav.close();
  }

  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
    this.sub?.unsubscribe();
  }
}
