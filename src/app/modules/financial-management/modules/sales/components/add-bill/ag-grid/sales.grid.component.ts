import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IService } from '../../../models/bill.interface';
import { SalesMoreActionsCell } from './custom-cell/sales-action.cell';
@Component({
  selector: 'app-sales-grid',
  template: '',
})
export class SalesGridComponent extends CoreBaseComponent {
  public rowData: IService[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.sales.service_name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<span>${params.data?.serviceName?.name || params.data?.parallelService?.name}</span>`;
        },
      },
      {
        headerName: 'table.sales.service_number',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<span>${params.data?.serviceNumber?.name || params.data?.request?.name}</span>`;
        },
      },
      // {
      //   headerName: 'table.sales.account_number',
      //   field: 'accountNumber',
      //   filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      // },
      {
        headerName: 'table.sales.price',
        cellRenderer: (params: ICellRendererParams) => {
          return `<span>${
            typeof params.data?.contractAmount === 'number'
              ? params.data?.contractAmount
              : typeof params.data?.amount === 'number'
              ? params.data?.amount
              : ''
          }</span>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.sales.tax_type',
        field: 'taxType.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.sales.details',
        field: 'details',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.sales.description',
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
        cellRenderer: SalesMoreActionsCell,
      },
    ];
  }
}
