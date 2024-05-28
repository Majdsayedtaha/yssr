import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractService } from '../../services/contract.service';
import { MatSidenav } from '@angular/material/sidenav';
import { IContractFormData } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'side-contract-details',
  templateUrl: './side-contract-details.component.html',
  styleUrls: ['./side-contract-details.component.scss'],
})
export class SideContractDetailsComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  contractDetails!: IContractFormData | null;
  totalAmount!: number;
  isLoading = false;

  constructor(@Inject(INJECTOR) injector: Injector, public contractService: ContractService) {
    super(injector);
  }
  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.contractService.sideContractDetails.pipe(untilDestroyed(this)).subscribe(data => {
      if (data?.id) {
        this.isLoading = true;
        this.sidenav.open();
        this.contractService
          .getContractDetails(data.id)
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.contractDetails = res.data;
            this.isLoading = false;
          });
      }
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.contractService.sideContractDetails.next(null);
  }
}
