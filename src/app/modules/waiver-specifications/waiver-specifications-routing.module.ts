import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from 'src/app/core/guards/role.guard';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';

const routes: Routes = [
  {
    path: 'table',
    title: AppRoutes.baseAppTitle + 'Waiver Specification Requests Table',
    component: WaiverRequestsTableComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.waiver.table',
      roleAccessor: IRoleEnum.ExternalWaiverRequest,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'table'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaiverRoutingModule { }
