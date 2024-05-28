import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { AddOrderFormComponent } from './components/add-order-form/add-order-form.component';
import { AddProcedureFormComponent } from './components/add-procedure-form/add-procedure-form.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Orders table',
    component: OrdersTableComponent,
    canActivate: [roleGuard],
    data: {
      roleAccessor: IRoleEnum.ReturnRequest,
      roleActions: [IRolePermissionsEnum.canView],
      breadcrumb: 'label.refund.table',
    },
  },
  {
    path: 'add-order',
    title: AppRoutes.baseAppTitle + 'Add Orders',
    component: AddOrderFormComponent,
    canActivate: [roleGuard],
    data: {
      roleAccessor: IRoleEnum.ReturnRequest,
      roleActions: [IRolePermissionsEnum.canAdd],
      breadcrumb: 'label.refund.add_order',
    },
  },
  {
    path: 'edit-order/:id',
    title: AppRoutes.baseAppTitle + 'Edit Orders',
    component: AddOrderFormComponent,
    canActivate: [roleGuard],
    data: {
      roleAccessor: IRoleEnum.ReturnRequest,
      roleActions: [IRolePermissionsEnum.canUpdate],
      breadcrumb: 'label.refund.update_order',
    },
  },
  {
    path: 'add-procedure',
    title: AppRoutes.baseAppTitle + 'Orders Procedure',
    component: AddProcedureFormComponent,
    canActivate: [roleGuard],
    data: {
      roleAccessor: IRoleEnum.ReturnRequest,
      roleActions: [IRolePermissionsEnum.canAdd],
      breadcrumb: 'label.refund.add_procedure',
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
export class RefundManagementRoutingModule {}
