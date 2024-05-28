import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PurchasesReboundRoutingModule } from './purchases-rebound-routing.module';
import { PurchasesReboundBillComponent } from './components/purchases-rebound-bill/purchases-rebound-bill.component';
import { PurchasesReboundTableComponent } from './components/purchases-rebound-table/purchases-rebound-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { PurchasesReboundGridComponent } from './components/purchases-rebound-table/ag-grid/purchases.grid.component';
import { PurchasesReboundMoreActionsCell } from './components/purchases-rebound-table/ag-grid/cell-action/action-more.cell';

@NgModule({
  declarations: [
    PurchasesReboundBillComponent,
    PurchasesReboundTableComponent,
    PurchasesReboundGridComponent,
    PurchasesReboundMoreActionsCell,
  ],
  imports: [CommonModule, PurchasesReboundRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class PurchasesReboundModule {}
