import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { BillsExchangeCell } from './more-action';
@Component({
  selector: 'app-BillsExchange-grid',
  template: '',
})
export class BillsExchangeGridComponent extends CoreBaseComponent {
  public rowData: any[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.financial_management.side',
        field: 'sideTypeId.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.expense_type',
        field: 'expenseTypeId.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.tax_type',
        field: 'taxTypeId.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.amount',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        field: 'amount',
        // cellRenderer: (params: ICellRendererParams) => {
        //   return `<span>${params.data?.serviceName?.name || params.data?.parallelService?.name}</span>`;
        // },
      },
      {
        headerName: 'field.financial_management.description',
        field: 'description',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 75,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: BillsExchangeCell,
      },
    ];
  }
}
