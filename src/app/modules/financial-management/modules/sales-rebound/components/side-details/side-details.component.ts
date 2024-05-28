import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { SalesReboundService } from '../../services/sales-rebound.service';
@UntilDestroy()
@Component({
  selector: 'app-side-details',
  templateUrl: './side-details.component.html',
  styleUrls: ['./side-details.component.scss'],
})
export class SideDetailsComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  public columnDefs: ColDef[] = [];
  isLoading = false;
  serviceData:any;
  constructor(@Inject(INJECTOR) injector: Injector, public salesReboundService: SalesReboundService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.isLoading = true;
    this.salesReboundService.sideData.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.isLoading = false;
        this.serviceData=data
        this.sidenav.open();
      }
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.salesReboundService.sideData.next(null);
  }
}
