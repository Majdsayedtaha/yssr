import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { SalesMoreActionsCell } from './components/add-bill/ag-grid/custom-cell/sales-action.cell';
import { DialogServiceFormComponent } from './components/add-bill/dialog/dialog-service-form/dialog-service-form.component';
import { BillsMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/bills-action-more.cell';

@NgModule({
  declarations: [SalesMoreActionsCell, DialogServiceFormComponent, BillsMoreActionsCell],
  imports: [CommonModule, SalesRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class SalesModule {}
