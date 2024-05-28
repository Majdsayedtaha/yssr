//Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { CustomersTableComponent } from './components/customers-table/customers-table.component';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Customers table',
    component: CustomersTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.customer.table',
      roleAccessor: IRoleEnum.Customer,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add',
    component: CustomerFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Add customer',
    data: {
      breadcrumb: 'label.customer.add',
      roleAccessor: IRoleEnum.Customer,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update/:id',
    component: CustomerFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Update customer',
    data: {
      breadcrumb: 'label.customer.update',
      roleAccessor: IRoleEnum.Customer,
      roleActions: [IRolePermissionsEnum.canUpdate]
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
export class CustomersRoutingModule { }
