import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { WaiverRequestStatusCell } from './cellRenderers/request-status.cell';
import { WaiverMoreActionsCell } from './cellRenderers/actions.cell';
import { TypeOrderCell } from './cellRenderers/type-order.cell';
@Component({
  selector: 'waiver-table-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class WaiverOrdersGridComponent extends CoreBaseComponent {
  public rowData!: [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'order_number',
        field: 'requestNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'order_date',
        field: 'requestDate',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
        cellRenderer: (params: ICellRendererParams) => {
          return `<div>${this.timezoneToDatePipe.transform(params.value)}</div>`;
        },
      },
      {
        headerName: 'customer_name',
        field: 'customerName',
        // cellRenderer: (params: ICellRendererParams) => {
        //   return this.timezoneToDatePipe.transform(params.value);
        // },
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'worker_name',
        field: 'workerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'age',
        field: 'age',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'country',
        field: 'country',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'type',
        field: 'isExternal',
        cellRenderer: TypeOrderCell,
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        minWidth: 250,
        filterParams: {
          options: [
            { name: 'order_waiver', value: true },
            { name: 'order_worker', value: false },
          ],
        },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'job',
        field: 'job',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'religion',
        field: 'religion',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'order_status',
        field: 'sponsorshipTransferred',
        minWidth: 250,
        cellRenderer: WaiverRequestStatusCell,
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        filterParams: {
          options: [
            { name: 'request-not-moved', value: false },
            { name: 'request-moved', value: true },
          ],
        },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: WaiverMoreActionsCell,
      },
    ];
  }
}
