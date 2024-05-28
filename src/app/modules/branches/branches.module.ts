import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchFormComponent } from './components/branch-form/branch-form.component';
import { ManagersTableComponent } from './components/managers-table/managers-table.component';
import { ManagerFormComponent } from './components/manager-form/manager-form.component';
import { CoreModule } from 'src/app/core/core.module';
import { SideBranchDetailsComponent } from './components/side-branch-details/side-branch-details.component';
import { BranchesTableComponent } from './components/branches-table/branches-table.component';
import { BranchesMoreActionsCell } from './components/branches-table/agGrid/custom-cell/branch-more-action.cell';
import { BranchesManagerMoreActionsCell } from './components/managers-table/agGrid/custom-cell/manager-brach-more-action.cell';

@NgModule({
  declarations: [
    BranchesTableComponent,
    BranchFormComponent,
    ManagersTableComponent,
    ManagerFormComponent,
    BranchesMoreActionsCell,
    BranchesManagerMoreActionsCell,
    SideBranchDetailsComponent,
  ],
  imports: [CommonModule, BranchesRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class BranchesModule {}
