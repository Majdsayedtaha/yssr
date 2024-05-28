import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDelegationsRequest } from '../../models';
import { ElectronicAuthService } from '../../services/delegations.service';
import { of, switchMap, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'waiver-specification-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss'],
})
export class SideInfoWaiverComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  requestData?: IDelegationsRequest;
  isLoading = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _ElectronicAuthService: ElectronicAuthService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._ElectronicAuthService.requestId
      .pipe(
        untilDestroyed(this),
        tap(res => {
          this.sidenav.open();
          this.isLoading = true;
        }),
        switchMap(res => {
          if (res) return this._ElectronicAuthService.fetchRequestDetails(res);
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
    this._ElectronicAuthService.requestId.next(null);
    this.sidenav.close();
  }

  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
