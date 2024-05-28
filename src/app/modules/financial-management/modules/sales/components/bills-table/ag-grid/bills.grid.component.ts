import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { BillsMoreActionsCell } from './custom-cell/bills-action-more.cell';
@Component({
  selector: 'app-bills-grid',
  template: '',
})
export class BillsGridComponent extends CoreBaseComponent {
  public rowData: any[] = [];
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
          filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.billType',
          field: 'type',
          filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        },
        // {
        //   headerName: 'field.financial_management.dateBenefits',
        //   field: 'dateBenefits',
        //   filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // },
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
          cellRenderer: BillsMoreActionsCell,
        },
      ];
    }
  }
}
