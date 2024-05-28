import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, SuppressKeyboardEventParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IPurchases } from '../../../models/purchases.interface';
import { reboundAmountCell } from './rebound-amount-cell.component';

@Component({
  selector: 'app-purchases-grid',
  template: '',
})
export class PurchasesGridComponent extends CoreBaseComponent {
  public rowData: IPurchases[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.purchases.contract_number',
        field: 'requestNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.contract_date',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.customer',
        field: 'customer',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.worker',
        field: 'worker',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.benefit_number',
        field: 'amount',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.rebound_number',
        field: 'refundAmount',
        cellRenderer: reboundAmountCell,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
        suppressKeyboardEvent: this.suppressKeyboardEvent,
      },
    ];
  }

  suppressKeyboardEvent(params: SuppressKeyboardEventParams) {
    const e = params.event;
    if (e.code == 'Tab' || e.key == 'Tab') return true;
    return false; // Do not suppress by default
  }
}
