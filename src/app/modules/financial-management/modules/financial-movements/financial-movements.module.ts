import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FinancialMovementsRoutingModule } from './financial-movements-routing.module';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { MovementMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/bills-action-more.cell';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddBillComponent, BillsTableComponent, MovementMoreActionsCell],
  imports: [CommonModule, FormsModule, CoreModule, FinancialMovementsRoutingModule],
  providers: [DatePipe],
})
export class FinancialMovementsModule {}
