import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBillExchange, IBillExchangeTable } from '../../../models/bill-exchange.interface';
import { BillsExchangeMoreActionsCell } from './custom-cell/bills-action-more.cell';

@Component({
  selector: 'app-bills-exchange-grid',
  template: '',
})
export class BillsExchangeTableGridComponent extends CoreBaseComponent {
  public rowData: IBillExchangeTable[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.financial_management.type_account',
        field: 'side',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.payment_type',
        field: 'paymentType',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.history_bond',
        field: 'historyBond',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.type_bill_exchange',
        field: 'typeBillExchange',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.amount',
        field: 'amount',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },

      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: BillsExchangeMoreActionsCell,
      },
    ];
  }
}
