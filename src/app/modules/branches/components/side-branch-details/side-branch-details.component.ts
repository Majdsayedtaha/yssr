import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBranchForm } from '../../models';
@UntilDestroy()
@Component({
  selector: 'side-branch-details',
  templateUrl: './side-branch-details.component.html',
  styleUrls: ['./side-branch-details.component.scss'],
})
export class SideBranchDetailsComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  isLoading = false;
  branchData!: IBranchForm;
  constructor(@Inject(INJECTOR) injector: Injector, public branchService: BranchService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.branchService.sideBranchDetails.pipe(untilDestroyed(this)).subscribe(res => {
      if (res?.id) {
        this.isLoading = true;
        this.sidenav.open();
        this.branchService.getBranchInfo(res.id).subscribe(res => {
          this.isLoading = false;
          this.branchData = res.data as IBranchForm;
        });
      }
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.branchService.sideBranchDetails.next(null);
  }
}
