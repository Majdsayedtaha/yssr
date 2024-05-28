import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of, switchMap, tap } from 'rxjs';
import { WaiverSpecificationService } from 'src/app/modules/waiver-specifications/services/waiver-specifications.service';
import { IWaiverSpecificationRequest } from 'src/app/modules/waiver-specifications/models';
import { IEnum } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'waiver-external-side-info',
  templateUrl: './side-info-external.component.html',
  styleUrls: ['./side-info-external.component.scss'],
})
export class SideInfoWaiverExternalComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  waiverData?: IWaiverSpecificationRequest;
  isLoading = false;
  waiverId!: string;
  allSkills: IEnum[] = [];

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _waiverSpecificationService: WaiverSpecificationService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
    this.fetchData();
  }

  fetchData() {
    this.fetchSkills()
      .pipe(untilDestroyed(this))
      .subscribe(response => this.allSkills = response.data);
  }

  checkIfNeedToOpen() {
    this._waiverSpecificationService.requestId
      .pipe(
        untilDestroyed(this),
        tap(res => {
          this.sidenav.open();
          this.isLoading = true;
        }),
        switchMap(res => {
          if (res) {
            this.waiverId = res;
            return this._waiverSpecificationService.fetchWaiverSpecificationDetails(this.waiverId);
          }
          else return of(null);
        })
      )
      .subscribe({
        next: waiverRequest => {
          this.isLoading = false;
          if (waiverRequest) {
            this.waiverData = waiverRequest.data;
          }
        },
        error: err => {
          this.isLoading = false;
        },
      });
  }

  findArrayName(array: IEnum[], Id: string): string | undefined {
    return array.find(el => el.id === Id)?.name;
  }


  closeSideNav() {
    this._waiverSpecificationService.requestId.next(null);
    this.sidenav.close();
  }

  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
