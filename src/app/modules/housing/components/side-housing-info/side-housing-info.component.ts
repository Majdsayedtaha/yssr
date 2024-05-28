import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';
import { HousingService } from '../../services/housing.service';
import { IHousing, IHousingFormData } from '../../models';

@UntilDestroy()
@Component({
  selector: 'side-housing-info',
  templateUrl: './side-housing-info.component.html',
  styleUrls: ['./side-housing-info.component.scss']
})
export class SideHousingInfoComponent extends CoreBaseComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  housingData!: IHousingFormData;
  isLoading = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _housingService: HousingService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._housingService.getHousingIdSubject().subscribe(housingId => {
      if (housingId) {
        this.isLoading = true;
        this.sidenav.open();
        this._housingService
          .infoHousing(housingId)
          .pipe(untilDestroyed(this), finalize(() => (this.isLoading = false)))
          .subscribe(response => this.housingData = response.data as IHousingFormData);
      }
    });
  }

  closeSideNav() {
    this.sidenav.close();
    this._housingService.setHousingIdSubject(null);
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
