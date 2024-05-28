import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { PurchasesMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/bills-action-more.cell';
import { reboundAmountCell } from './components/add-bill/ag-grid/rebound-amount-cell.component';

@NgModule({
  declarations: [AddBillComponent, BillsTableComponent, PurchasesMoreActionsCell, reboundAmountCell],
  imports: [CommonModule, CoreModule, PurchasesRoutingModule],
  providers: [DatePipe],
})
export class PurchasesModule {}
