import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IContractProcedure } from '../../models';
import { ContractProcedureService } from '../../services/contract-procedure.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'side-contract-procedures',
  templateUrl: './side-contract-procedures.component.html',
  styleUrls: ['./side-contract-procedures.component.scss'],
})
export class SideContractProceduresComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  contractProcedures!: IContractProcedure[];
  dataCustomer!: IContractProcedure | null;
  constructor(@Inject(INJECTOR) injector: Injector, private _contractProceduresService: ContractProcedureService) {
    super(injector);
  }
  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._contractProceduresService.sideContractProcedures.pipe(untilDestroyed(this)).subscribe(data => {
      this.dataCustomer = data;
      if (data?.id) {
        this._contractProceduresService.getProcedureToContractDetail(data.id).pipe(untilDestroyed(this)).subscribe(res => {
          this.sidenav.open();
          this.contractProcedures = res.data;
        });
      }
    });
  }

  close() {
    this.sidenav.close();
    this._contractProceduresService.sideContractProcedures.next(null);
  }

  edit(procedure: IContractProcedure) {
    this.sidenav.close();
    this._contractProceduresService.sidenavAddProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        data?.open();
      }
    });
    this._contractProceduresService.sideAddProcedure.next({ contractInfo: this.dataCustomer, procedure });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._contractProceduresService.sideContractProcedures.next(null);
  }
}
