import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SuretyTransferRoutingModule } from './surety-transfer-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from '../layout/layout.module';
import { CompletedOrdersTableComponent } from './components/completed-order-table/completed-orders-table.component';
import { CompletedOrdersMoreActionsCell } from './components/completed-order-table/ag-grid/cellRenderers/actions.cell';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { TransferTypeCell } from './components/completed-order-table/ag-grid/cellRenderers/transfer-type.cell';
import { SideInfoSuretyComponent } from './components/side-info/side-info.component';

@NgModule({
  declarations: [
    CompletedOrdersTableComponent,
    CompletedOrdersMoreActionsCell,
    TransferTypeCell,
    OrderFormComponent,
    SideInfoSuretyComponent,
  ],
  imports: [CommonModule, SuretyTransferRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class SuretyTransferModule {}
