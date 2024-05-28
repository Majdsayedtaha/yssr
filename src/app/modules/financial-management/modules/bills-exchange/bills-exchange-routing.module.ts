import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';

const routes: Routes = [
  {
    path: 'documents-table',
    title: AppRoutes.baseAppTitle + 'Documents table',
    component: BillsTableComponent,
    data: {
      breadcrumb: 'label.financial.table_document',
    },
  },
  {
    path: 'add-document',
    title: AppRoutes.baseAppTitle + 'Add Document',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.add_document',
    },
  },
  {
    path: 'update-document/:id',
    title: AppRoutes.baseAppTitle + 'update Document',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.update_document',
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'documents-table',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsExchangeRoutingModule {}
