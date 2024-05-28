import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';
import { WaiverFormRequestWaiverComponent } from './components/request-form-waiver/request-form-waiver.component';
import { WaiverFormRequestWorkerComponent } from './components/request-form-worker/request-form-worker.component';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Waivers Table',
    component: WaiverRequestsTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.table',
      roleAccessor: IRoleEnum.WaiverRequest,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'add-request-waiver',
    title: AppRoutes.baseAppTitle + 'Add Waiver Request',
    component: WaiverFormRequestWaiverComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.add_waiver',
      roleAccessor: IRoleEnum.WaiverRequest,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'add-request-worker',
    title: AppRoutes.baseAppTitle + 'Add Worker Request',
    component: WaiverFormRequestWorkerComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.add_worker',
      roleAccessor: IRoleEnum.ExternalWaiverRequest,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'waiver-update/:id',
    title: AppRoutes.baseAppTitle + 'Update Waiver Request',
    component: WaiverFormRequestWaiverComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.update',
      roleAccessor: IRoleEnum.WaiverRequest,
      roleActions: [IRolePermissionsEnum.canUpdate],
    },
  },
  {
    path: 'worker-update/:id',
    title: AppRoutes.baseAppTitle + 'Update Worker Request',
    component: WaiverFormRequestWorkerComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.update',
      roleAccessor: IRoleEnum.ExternalWaiverRequest,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  {
    path: 'add-procedure',
    title: AppRoutes.baseAppTitle + 'procedure add',
    component: AddProcedureComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.add_procedure',
      roleAccessor: IRoleEnum.ExternalWaiverRequest,
      roleActions: [IRolePermissionsEnum.canAdd]
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
export class WaiverRoutingModule { }
