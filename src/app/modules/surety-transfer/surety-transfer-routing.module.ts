import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { CompletedOrdersTableComponent } from './components/completed-order-table/completed-orders-table.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'completed-orders',
    title: AppRoutes.baseAppTitle + 'Completed Orders',
    component: CompletedOrdersTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.order.completed',
      roleAccessor: IRoleEnum.SponsorshipTransfer,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add-order',
    title: AppRoutes.baseAppTitle + 'Add Order',
    component: OrderFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.order.add',
      roleAccessor: IRoleEnum.SponsorshipTransfer,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'add-order/:customerId/:name',
    title: AppRoutes.baseAppTitle + 'Add Order',
    component: OrderFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.order.add',
      roleAccessor: IRoleEnum.SponsorshipTransfer,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update-order/:id',
    title: AppRoutes.baseAppTitle + 'Update Order',
    component: OrderFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.order.update',
      roleAccessor: IRoleEnum.SponsorshipTransfer,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  { path: '', pathMatch: 'full', redirectTo: 'completed-orders' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuretyTransferRoutingModule { }
