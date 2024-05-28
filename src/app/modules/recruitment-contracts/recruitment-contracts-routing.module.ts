//Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';

//Components
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';
import { ContractsTableComponent } from './components/contracts-table/contracts-table.component';
import { RecruitmentOrdersComponent } from './components/warranty-table/warranty-table.component';
import { RecruitmentContractFormComponent } from './components/recruitment-contract-form/recruitment-contract-form.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Contracts table',
    component: ContractsTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.table',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'add-contract',
    title: AppRoutes.baseAppTitle + 'Add contract',
    component: RecruitmentContractFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.add',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'add-contract/:customerId/:name',
    title: AppRoutes.baseAppTitle + 'Add contract',
    component: RecruitmentContractFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.add',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canAdd],
    },
  },
  {
    path: 'update/:id',
    title: AppRoutes.baseAppTitle + 'Edit contract',
    component: RecruitmentContractFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.edit',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canUpdate],
    },
  },
  {
    path: 'add-procedure',
    title: AppRoutes.baseAppTitle + 'procedure add',
    component: AddProcedureComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.contract.action',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canAdd, IRolePermissionsEnum.canUpdate],
    },
  },
  {
    path: 'orders',
    title: AppRoutes.baseAppTitle + 'Recruitment orders',
    component: RecruitmentOrdersComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.recruitment.orders',
      roleAccessor: IRoleEnum.RecruitmentContract,
      roleActions: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canUpdate],
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
export class RecruitmentContractsRoutingModule {}
