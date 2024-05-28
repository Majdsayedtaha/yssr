import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { BillsTableComponent } from './components/bills-table/bills-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { PaymentAmountEditCell } from './components/add-bill/ag-grid/custom-cell/payment-amount-edit.cell';
import { DialogPaymentAmountEditComponent } from './components/add-bill/dialog/dialog-payment-amount-edit/dialog-payment-amount-edit.component';
import { ReceiptMoreActionsCell } from './components/bills-table/ag-grid/custom-cell/bills-action-more.cell';

@NgModule({
  declarations: [
    AddBillComponent,
    BillsTableComponent,
    PaymentAmountEditCell,
    ReceiptMoreActionsCell,
    DialogPaymentAmountEditComponent,
  ],
  imports: [CommonModule, CoreModule, ReceiptRoutingModule],
  providers: [DatePipe],
})
export class ReceiptModule {}
