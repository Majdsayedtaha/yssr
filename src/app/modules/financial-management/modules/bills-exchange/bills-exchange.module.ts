import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BillsExchangeRoutingModule } from './bills-exchange-routing.module';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { BillsExchangeMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/bills-action-more.cell';
import { DialogBillsExchangeComponent } from './components/add-bill/dialog-BillsExchange/dialog-BillsExchange.component';
import { BillsExchangeCell } from './components/add-bill/ag-grid/more-action';

@NgModule({
  declarations: [
    AddBillComponent,
    BillsTableComponent,
    BillsExchangeMoreActionsCell,
    DialogBillsExchangeComponent,
    BillsExchangeCell,
  ],
  imports: [CommonModule, CoreModule, BillsExchangeRoutingModule],
  providers: [DatePipe],
})
export class BillsExchangeModule {}
