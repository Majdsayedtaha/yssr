import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalesReboundRoutingModule } from './sales-rebound-routing.module';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { DialogSalesReboundComponent } from './components/add-bill/dialog/dialog-sales-rebound/dialog-sales-rebound.component';
import { SalesReboundMoreActionsCell } from './components/add-bill/ag-grid/custom-cell/sales-rebound-action';
import { CoreModule } from 'src/app/core/core.module';
import { BillsReboundMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/sales-rebound-action';
import { SideDetailsComponent } from './components/side-details/side-details.component';

@NgModule({
  declarations: [
    AddBillComponent,
    SalesReboundMoreActionsCell,
    BillsReboundMoreActionsCell,
    BillsTableComponent,
    DialogSalesReboundComponent,
    SideDetailsComponent,
  ],
  imports: [CommonModule, CoreModule, SalesReboundRoutingModule],
  providers: [DatePipe],
})
export class SalesReboundModule {}
