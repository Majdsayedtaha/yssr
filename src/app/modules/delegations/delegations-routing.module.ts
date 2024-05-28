import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { ElectFormRequestComponent } from './components/request-form/request-form.component';
import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Delegations Requests Table',
    component: WaiverRequestsTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.delegations.table',
      roleAccessor: IRoleEnum.DelegationRequest,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add-request',
    title: AppRoutes.baseAppTitle + 'Add Delegations Request',
    component: ElectFormRequestComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.delegations.add',
      roleAccessor: IRoleEnum.DelegationRequest,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update/:id',
    title: AppRoutes.baseAppTitle + 'Update Delegations Request',
    component: ElectFormRequestComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.delegations.update',
      roleAccessor: IRoleEnum.DelegationRequest,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'table'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicAuthorizationRoutingModule { }
