import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IService } from '../../../models/bill-rebound.interface';
import { SalesReboundMoreActionsCell } from './custom-cell/sales-rebound-action';
@Component({
  selector: 'app-sales-rebound-grid',
  template: '',
})
export class SalesReboundGridComponent extends CoreBaseComponent {
  public rowData: IService[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.sales.service_name',
        // field: 'serviceName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<span> ${params.data?.serviceName || params.data?.parallelService?.name} </span>`;
        },
      },
      {
        headerName: 'table.sales.service_number',
        // field: 'serviceNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<span> ${params.data?.serviceNumber || params.data?.request?.name} </span>`;
        },
      },
      {
        headerName: 'table.sales.price',
        // field: 'price',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<span> ${params.data?.price || params.data?.amount} </span>`;
        },
      },
      {
        headerName: 'table.sales.tax_type',
        field: 'taxType.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // cellRenderer: (params: ICellRendererParams) => {
        //   return `<span> ${params.data?.taxType?.name || params.data?.taxType || ''} </span>`;
        // },
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
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: SalesReboundMoreActionsCell,
      },
    ];
  }
}
