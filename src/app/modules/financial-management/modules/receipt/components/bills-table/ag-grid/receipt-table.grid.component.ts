import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBillReceiptTable } from '../../../models/bill-receipt.interface';
import { ReceiptMoreActionsCell } from './custom-cell/bills-action-more.cell';

@Component({
  selector: 'app-receipt-table-grid',
  template: '',
})
export class ReceiptTableGridComponent extends CoreBaseComponent {
  public rowData: IBillReceiptTable[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.financial_management.type_account',
        field: 'sideType',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.payment_type',
        field: 'paymentDestination',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.history_bond',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.amount',
        field: 'amount',
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
        cellRenderer: ReceiptMoreActionsCell,
      },
    ];
  }
}
