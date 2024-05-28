import { NgModule } from '@angular/core';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { RouterModule, Routes } from '@angular/router';
import { FileAcceptanceComponent } from './components/file-acceptance/file-acceptance.component';
import { FileContingencyComponent } from './components/file-contingency/file-contingency.component';
import { FileInfoSheetComponent } from './components/file-info/file-info.component';
import { FileMedicalComponent } from './components/file-medical/file-medical.component';
import { FileRunawayComponent } from './components/file-runaway/file-runaway.component';
import { FileAffidavitComponent } from './components/file-affidavit/file-affidavit.component';

const routes: Routes = [
  {
    path: 'acceptance',
    title: AppRoutes.baseAppTitle + 'File Acceptance',
    data: {
      breadcrumb: 'label.file.acceptance',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileAcceptanceComponent
  },
  {
    path: 'contingency',
    title: AppRoutes.baseAppTitle + 'File Contingency',
    data: {
      breadcrumb: 'label.file.contingency',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileContingencyComponent
  },
  {
    path: 'info',
    title: AppRoutes.baseAppTitle + 'File Info Sheet',
    data: {
      breadcrumb: 'label.file.info',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileInfoSheetComponent
  },
  {
    path: 'medical',
    title: AppRoutes.baseAppTitle + 'File Medical',
    data: {
      breadcrumb: 'label.file.medical',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileMedicalComponent
  },
  {
    path: 'runaway',
    title: AppRoutes.baseAppTitle + 'File Runaway',
    data: {
      breadcrumb: 'label.file.runaway',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileRunawayComponent
  },
  {
    path: 'affidavit',
    title: AppRoutes.baseAppTitle + 'File Affidavit',
    data: {
      breadcrumb: 'label.file.affidavit',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
    component: FileAffidavitComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
