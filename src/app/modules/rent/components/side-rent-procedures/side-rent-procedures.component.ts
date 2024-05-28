import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RentService } from '../../services/rent.service';
import { IRentLogProcedure } from '../../models/rent.interface';
import { finalize } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'side-rent-procedures',
  templateUrl: './side-rent-procedures.component.html',
  styleUrls: ['./side-rent-procedures.component.scss'],
})
export class SideRentProceduresComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  //#region  Decorators
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  //#endregion

  //#region Variables
  procedures: IRentLogProcedure[] = [];
  loading: boolean = false;
  rentInfo: any;
  //#endregion

  constructor(@Inject(INJECTOR) injector: Injector, private _rentService: RentService) {
    super(injector);
  }

  //#region Subscribe
  checkIfNeedToOpen() {
    this._rentService
      .getLogProcedureIdSubject()
      .pipe(untilDestroyed(this))
      .subscribe(rent => {
        if (rent) {
          this.rentInfo = rent;
          this.sidenav.open();
          this.loading = true;
          this._rentService
            .lastProcedures(rent.id)
            .pipe(
              untilDestroyed(this),
              finalize(() => (this.loading = false))
            )
            .subscribe(res => {
              this.procedures = res.data as IRentLogProcedure[];
            });
        }
      });
  }
  //#endregion

  //#region Actions
  close() {
    this.sidenav.close();
    this._rentService.setLogProcedureIdSubject(null);
  }

  edit(procedure: IRentLogProcedure) {
    this.sidenav.close();
    this._rentService.sidenavAddProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        data?.open();
      }
    });
    this._rentService.setSelectedProcedureSubject({ rentInfo: this.rentInfo, procedure: procedure });
  }
  //#endregion

  //
  //#region Life Cycle Hooks
  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._rentService.setLogProcedureIdSubject(null);
  }
  //#endregion
}
