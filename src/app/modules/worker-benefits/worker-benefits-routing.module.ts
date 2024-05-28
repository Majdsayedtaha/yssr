import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { BenefitsTableComponent } from './components/benefits-table/benefits-table.component';
import { BenefitFormRequestComponent } from './components/benefit-form/benefit-form.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + "Workers' Benefits Table",
    component: BenefitsTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.benefit.title',
      roleAccessor: IRoleEnum.WorkerBenefit,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add',
    title: AppRoutes.baseAppTitle + "Add Worker's Benefit",
    component: BenefitFormRequestComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.benefit.add',
      roleAccessor: IRoleEnum.WorkerBenefit,
      roleActions: [IRolePermissionsEnum.canAdd]
    },
  },
  {
    path: 'update/:id',
    title: AppRoutes.baseAppTitle + "Update Worker's Benefit",
    component: BenefitFormRequestComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.benefit.update',
      roleAccessor: IRoleEnum.WorkerBenefit,
      roleActions: [IRolePermissionsEnum.canUpdate]
    },
  },
  { path: '', pathMatch: 'full', redirectTo: 'table' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerBenefitsRoutingModule { }
