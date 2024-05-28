import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';
import { IRent } from '../../models/rent.interface';
import { RentService } from '../../services/rent.service';

@UntilDestroy()
@Component({
  selector: 'side-info-rent',
  templateUrl: './side-info-rent.component.html',
  styleUrls: ['./side-info-rent.component.scss'],
})
export class SideInfoRentComponent extends CoreBaseComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  rentData!: IRent;
  allDetails: IEnum[] = [];
  allSkills: IEnum[] = [];
  isLoading = false;

  constructor(@Inject(INJECTOR) injector: Injector, private _rentService: RentService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
    this.fetchData();
  }

  fetchData() {
    this.fetchDetails()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.allDetails = response.data.map(el => <IEnum>{ id: el.id, name: el.value })));

    this.fetchSkills()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.allSkills = response.data));
  }

  checkIfNeedToOpen() {
    this._rentService.getRentIdSubject().subscribe(rentId => {
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

  findArrayName(array: IEnum[], Id: string): string | undefined {
    return array.find(el => el.id === Id)?.name;
  }

  closeSideNav() {
    this.sidenav.close();
    this._rentService.setRentIdSubject(null);
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
