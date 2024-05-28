import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { IRent } from '../../models/rent.interface';
import { RentService } from '../../services/rent.service';

@UntilDestroy()
@Component({
  selector: 'side-rent-financial',
  templateUrl: './side-rent-financial.component.html',
  styleUrls: ['./side-rent-financial.component.scss'],
})
export class SideRentFinancialComponent extends CoreBaseComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  rentData!: IRent | undefined;
  isLoading = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _rentService: RentService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._rentService.getFinancialSidebar().subscribe(rentId => {
      if (rentId) {
        this.isLoading = true;
        this.sidenav.open();
        this._rentService
          .infoRent(rentId)
          .pipe(untilDestroyed(this), finalize(() => (this.isLoading = false)))
          .subscribe(response => this.rentData = response.data as IRent);
      }
    });
  }

  closeSideNav() {
    this.sidenav.close();
    this._rentService.setFinancialSidebar(null);
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
