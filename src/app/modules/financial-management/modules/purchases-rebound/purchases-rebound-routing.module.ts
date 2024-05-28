import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { PurchasesReboundTableComponent } from './components/purchases-rebound-table/purchases-rebound-table.component';
import { PurchasesReboundBillComponent } from './components/purchases-rebound-bill/purchases-rebound-bill.component';

const routes: Routes = [
  {
    path: 'bills-table',
    title: AppRoutes.baseAppTitle + 'Bills table',
    component: PurchasesReboundTableComponent,
    data: {
      breadcrumb: 'label.financial.table_bill',
    },
  },
  {
    path: 'add-bill',
    title: AppRoutes.baseAppTitle + 'Add Bill',
    component: PurchasesReboundBillComponent,
    data: {
      breadcrumb: 'label.financial.add_bill',
    },
  },
  {
    path: 'update-bill/:id',
    title: AppRoutes.baseAppTitle + 'update Bill',
    component: PurchasesReboundBillComponent,
    data: {
      breadcrumb: 'label.financial.update_bill',
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bills-table',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesReboundRoutingModule { }
