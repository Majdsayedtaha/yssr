import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FinancialManagementRoutingModule } from './financial-management-routing.module';
import { AddBillComponent } from './modules/sales/components/add-bill/add-bill.component';
import { BillsTableComponent } from './modules/sales/components/bills-table/bills-table.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [AddBillComponent, BillsTableComponent],
  imports: [CommonModule, FinancialManagementRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class FinancialManagementModule {}
