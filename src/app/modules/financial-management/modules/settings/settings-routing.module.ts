import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { BanksTableComponent } from './components/banks-table/banks-table.component';
import { StorageTableComponent } from './components/storage-table/storage-table.component';
import { DevicesTableComponent } from './components/devices-table/devices-table.component';
import { NetworkTableComponent } from './components/network-table/network-table.component';
import { ExpenseTypeTableComponent } from './components/expense-type-table/expense-type-table.component';

const routes: Routes = [
  {
    path: 'banks',
    title: AppRoutes.baseAppTitle + 'Banks',
    component: BanksTableComponent,
    data: {
      breadcrumb: 'label.financial.banks',
    },
  },
  {
    path: 'storage',
    title: AppRoutes.baseAppTitle + 'Storage',
    component: StorageTableComponent,
    data: {
      breadcrumb: 'label.financial.storage',
    },
  },
  {
    path: 'devices',
    title: AppRoutes.baseAppTitle + 'Devices',
    component: DevicesTableComponent,
    data: {
      breadcrumb: 'label.financial.device',
    },
  },
  {
    path: 'networks',
    title: AppRoutes.baseAppTitle + 'Networks',
    component: NetworkTableComponent,
    data: {
      breadcrumb: 'label.financial.network',
    },
  },
  {
    path: 'expense-types',
    title: AppRoutes.baseAppTitle + 'Expense types',
    component: ExpenseTypeTableComponent,
    data: {
      breadcrumb: 'label.financial.expense',
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'storage',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
