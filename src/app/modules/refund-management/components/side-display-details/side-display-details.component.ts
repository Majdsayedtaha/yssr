import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { MatSidenav } from '@angular/material/sidenav';
import { IRefund } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'side-display-details',
  templateUrl: './side-display-details.component.html',
  styleUrls: ['./side-display-details.component.scss'],
})
export class SideDisplayDetailsComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  orderDetails!: IRefund | null;
  totalAmount!: number;
  isLoading = false;

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.refundService.sideOrderDetails.pipe(untilDestroyed(this)).subscribe(data => {
      this.orderDetails = data;
      if (data?.id) {
        this.sidenav.open();
        this.isLoading = true;
        this.refundService
          .getOrderDetails(data.id)
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.orderDetails = res.data;
            this.isLoading = false;
          });
      }
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.refundService.sideOrderDetails.next(null);
  }
}
