import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { WorkerFormComponent } from './components/worker-form/worker-form.component';
import { WorkerTableComponent } from './components/worker-table/worker-table.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Worker table',
    component: WorkerTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.worker.table',
      roleAccessor: IRoleEnum.Worker,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'add',
    title: AppRoutes.baseAppTitle + 'Add worker',
    component: WorkerFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.worker.add',
      roleAccessor: IRoleEnum.Worker,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'update/:id',
    title: AppRoutes.baseAppTitle + 'Update worker',
    component: WorkerFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.worker.update',
      roleAccessor: IRoleEnum.Worker,
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
export class WorkerRoutingModule {}
