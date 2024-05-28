import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { AccountAddComponent } from './components/account-add/account-add.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Users table',
    component: UsersTableComponent,
    data: {
      breadcrumb: 'label.user.table',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canUpdate, IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'add-user',
    title: AppRoutes.baseAppTitle + 'Add User',
    component: AccountAddComponent,
    data: {
      breadcrumb: 'label.user.add',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'update-user/:id',
    title: AppRoutes.baseAppTitle + 'Update User',
    component: AccountAddComponent,
    data: {
      breadcrumb: 'label.user.update',
      roleAccessor: IRoleEnum.Setting,
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
export class UsersRoutingModule { }
