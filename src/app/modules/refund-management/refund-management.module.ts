import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RefundManagementRoutingModule } from './refund-management-routing.module';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { AddOrderFormComponent } from './components/add-order-form/add-order-form.component';
import { AddProcedureFormComponent } from './components/add-procedure-form/add-procedure-form.component';
import { CoreModule } from 'src/app/core/core.module';
import { OrdersMoreActionsCell } from './components/orders-table/ag-grid/custom-cells/order-action-more.cell';
import { SideDisplayDetailsComponent } from './components/side-display-details/side-display-details.component';
import { SideAddProcedureComponent } from './components/side-add-procedure/side-add-procedure.component';
import { SideContractProceduresComponent } from './components/side-procedures/side-procedures.component';

@NgModule({
  declarations: [
    OrdersTableComponent,
    AddOrderFormComponent,
    AddProcedureFormComponent,
    OrdersMoreActionsCell,
    SideDisplayDetailsComponent,
    SideAddProcedureComponent,
    SideContractProceduresComponent,
  ],
  imports: [CommonModule, RefundManagementRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class RefundManagementModule {}
