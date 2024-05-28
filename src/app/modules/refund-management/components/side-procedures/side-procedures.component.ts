import { ILogRefundProcedure, IRefund, IRefundProcedure } from '../../models';
import { MatSidenav } from '@angular/material/sidenav';
import { RefundService } from '../../services/refund.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';

@UntilDestroy()
@Component({
  selector: 'side-procedures',
  templateUrl: './side-procedures.component.html',
  styleUrls: ['./side-procedures.component.scss'],
})
export class SideContractProceduresComponent extends CoreBaseComponent implements OnInit, OnDestroy {

  //Decorators
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  procedures!: ILogRefundProcedure[];
  selectedRow!: IRefund | null;
  constructor(@Inject(INJECTOR) injector: Injector, private _refundService: RefundService) {
    super(injector);
  }
  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._refundService.sideLogProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      this.selectedRow = data;
      if (data?.id) {
        this._refundService.getLastProcedures(data.id).pipe(untilDestroyed(this)).subscribe(res => {
          this.sidenav.open();
          this.procedures = res.data;
        });
      }
    });
  }

  close() {
    this.sidenav.close();
    this._refundService.sideLogProcedure.next(null);
  }

  edit(procedure: ILogRefundProcedure) {
    this.sidenav.close();
    this._refundService.sidenavAddProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        data?.open();
      }
    });
    this._refundService.sideAddProcedure.next({ contractInfo: this.selectedRow, procedure });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._refundService.sideLogProcedure.next(null);
  }
}
