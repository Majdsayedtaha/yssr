import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { BranchFormComponent } from './components/branch-form/branch-form.component';
import { BranchesTableComponent } from './components/branches-table/branches-table.component';
import { DatePipe } from '@angular/common';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Branches table',
    component: BranchesTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.branch.table',
      roleAccessor: IRoleEnum.Branch,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'add-branch',
    title: AppRoutes.baseAppTitle + 'Add Branch',
    component: BranchFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.branch.add',
      roleAccessor: IRoleEnum.Branch,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'update-branch/:id',
    title: AppRoutes.baseAppTitle + 'update Branch',
    component: BranchFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.branch.update',
      roleAccessor: IRoleEnum.Branch,
      roleActions: [IRolePermissionsEnum.canUpdate],
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'table',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchesRoutingModule {}
