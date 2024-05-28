import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
const routes: Routes = [
  {
    path: 'table-movements',
    title: AppRoutes.baseAppTitle + 'movements table',
    component: BillsTableComponent,
    data: {
      breadcrumb: 'label.financial.table_movement',
    },
  },
  {
    path: 'add-movement',
    title: AppRoutes.baseAppTitle + 'Add movement',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.add_movement',
    },
  },
  {
    path: 'update-movement/:id',
    title: AppRoutes.baseAppTitle + 'update movement',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.update_movement',
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'table-movements',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialMovementsRoutingModule { }
