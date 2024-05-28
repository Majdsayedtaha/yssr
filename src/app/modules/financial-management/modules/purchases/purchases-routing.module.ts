import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';

const routes: Routes = [
  {
    path: 'bills-table',
    title: AppRoutes.baseAppTitle + 'Bills table',
    component: BillsTableComponent,
    data: {
      breadcrumb: 'label.financial.table_bill',
    },
  },
  {
    path: 'add-bill',
    title: AppRoutes.baseAppTitle + 'Add Bill',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.add_bill',
    },
  },
  {
    path: 'update-bill/:id',
    title: AppRoutes.baseAppTitle + 'update Bill',
    component: AddBillComponent,
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
export class PurchasesRoutingModule { }
