import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { ExternalOfficeFormComponent } from './components/external-office-form/external-office-form.component';
import { UsersExternalOfficesComponent } from './components/users-external-offices/users-external-offices.component';
import { OfficeAgreementsPricesComponent } from './components/office-agreements-prices/office-agreements-prices.component';
import { ExternalOfficeTableComponent } from './components/external-office-table/external-office-table.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'external-offices',
    title: AppRoutes.baseAppTitle + 'External Offices',
    component: ExternalOfficeTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.offices.table',
      roleAccessor: IRoleEnum.ExternalOffice,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add-external-office',
    title: AppRoutes.baseAppTitle + 'Add External Office',
    component: ExternalOfficeFormComponent,
    data: {
      breadcrumb: 'label.offices.add',
      roleAccessor: IRoleEnum.ExternalOffice,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update-external-office/:id',
    title: AppRoutes.baseAppTitle + 'Update External Office',
    component: ExternalOfficeFormComponent,
    data: {
      breadcrumb: 'label.offices.update',
      roleAccessor: IRoleEnum.ExternalOffice,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  {
    path: 'external-office-users',
    title: AppRoutes.baseAppTitle + 'External Office Users',
    component: UsersExternalOfficesComponent,
    data: {
      breadcrumb: 'label.offices.user',
      roleAccessor: IRoleEnum.ExternalOfficeUser,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'office-agreements-prices',
    title: AppRoutes.baseAppTitle + 'Office Agreements Prices',
    component: OfficeAgreementsPricesComponent,
    data: {
      breadcrumb: 'label.offices.price',
      roleAccessor: IRoleEnum.ExternalOfficeUser,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'external-offices',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficesRoutingModule { }
// offices/external-offices
