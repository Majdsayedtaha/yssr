import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBillsReturnTableSales } from '../../../models/bill-rebound.interface';
import { BillsReboundMoreActionsCell } from './custom-cell/sales-rebound-action';
@Component({
  selector: 'app-bills-rebound-grid',
  template: '',
})
export class BillsReboundGridComponent extends CoreBaseComponent {
  public rowData: IBillsReturnTableSales[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    {
      this.columnDefs = [
        {
          headerName: 'field.financial_management.date',
          field: 'date',
          filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.billNumber',
          field: 'billNumber',
          filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.billType',
          field: 'type',
          filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.dateBenefits',
          field: 'date',
          filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
        },
        {
          headerName: 'customer_name',
          field: 'customerName',
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
          cellRenderer: BillsReboundMoreActionsCell,
        },
      ];
    }
  }
}
