import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentTableComponent } from './components/rent-table/rent-table.component';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { RentFormComponent } from './components/rent-form/rent-form.component';
import { RentProcedureFormComponent } from './components/rent-procedure-form/rent-procedure-form.component';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { WorkerRentTableComponent } from './components/worker-rent-table/worker-rent-table.component';

const routes: Routes = [
  {
    path: 'table',
    component: RentTableComponent,
    title: AppRoutes.baseAppTitle + 'Rent Table',
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.table',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add',
    component: RentFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Rent Form',
    data: {
      breadcrumb: 'label.contract.add',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'add/:customerId/:name',
    component: RentFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Rent Form',
    data: {
      breadcrumb: 'label.contract.add',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'procedure-add',
    component: RentProcedureFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Rent Procedure',
    data: {
      breadcrumb: 'label.contract.action',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update/:id',
    component: RentFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Rent Update',
    data: {
      breadcrumb: 'label.rent.update',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  {
    path: 'rent-workers',
    component: WorkerRentTableComponent,
    title: AppRoutes.baseAppTitle + 'Rent Workers',
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.rent_workers',
      roleAccessor: IRoleEnum.RentRequest,
      roleActions: [IRolePermissionsEnum.canView]
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
export class RentRoutingModule { }
