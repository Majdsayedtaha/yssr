import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { HousingFormComponent } from './components/housing-form/housing-form.component';
import { HousingTableComponent } from './components/housing-table/housing-table.component';
import { WorkerHousingFormComponent } from './components/worker-housing-form/worker-housing-form.component';

const routes: Routes = [
  {
    path: 'table',
    component: HousingTableComponent,
    title: AppRoutes.baseAppTitle + 'Housing Table',
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.residence.title',
      roleAccessor: IRoleEnum.Housing,
      roleActions: [IRolePermissionsEnum.canView]
    }
  },
  {
    path: 'add',
    component: HousingFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Housing Form',
    data: {
      breadcrumb: 'label.residence.add',
      roleAccessor: IRoleEnum.Housing,
      roleActions: [IRolePermissionsEnum.canAdd]
    }
  },
  {
    path: 'update/:id',
    component: HousingFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Housing Form Updated',
    data: {
      breadcrumb: 'label.residence.edit',
      roleAccessor: IRoleEnum.Housing,
      roleActions: [IRolePermissionsEnum.canUpdate]
    }
  },
  {
    path: 'employee-add',
    component: WorkerHousingFormComponent,
    canActivate: [roleGuard],
    title: AppRoutes.baseAppTitle + 'Housing Worker Form',
    data: {
      breadcrumb: 'label.residence.employee',
      roleAccessor: IRoleEnum.Housing,
      roleActions: [IRolePermissionsEnum.canAdd]
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: "table"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingRoutingModule { }
