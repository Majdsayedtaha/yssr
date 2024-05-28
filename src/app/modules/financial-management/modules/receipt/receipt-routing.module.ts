import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { AddBillComponent } from './components/add-bill/add-bill.component';

const routes: Routes = [
  {
    path: 'documents-table',
    title: AppRoutes.baseAppTitle + 'Document table',
    component: BillsTableComponent,
    data: {
      breadcrumb: 'label.financial.table_document',
    },
  },
  {
    path: 'add-document',
    title: AppRoutes.baseAppTitle + 'Add document',
    component: AddBillComponent,
    data: {
      breadcrumb: 'label.financial.add_document',
    },
  },
  {
    path: 'update-document/:id',
    title: AppRoutes.baseAppTitle + 'update document',
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
export class ReceiptRoutingModule {}
