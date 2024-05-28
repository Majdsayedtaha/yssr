import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBillReceipt } from '../../../models/bill-receipt.interface';
import { PaymentAmountEditCell } from './custom-cell/payment-amount-edit.cell';

@Component({
  selector: 'app-receipt-grid',
  template: '',
})
export class ReceiptGridComponent extends CoreBaseComponent {
  public rowData: IBillReceipt[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.receipt.sales_invoice_number',
        field: 'salesInvoiceNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.date',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.total_amount',
        field: 'totalAmount',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.tax_value',
        field: 'taxValue',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.Net',
        field: 'net',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.paid_up',
        field: 'paidUp',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.residual',
        field: 'residual',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.receipt.payment_amount',
        field: 'paymentAmount',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: PaymentAmountEditCell,
      },
    ];
  }
}
