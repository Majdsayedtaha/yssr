import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ElectronicAuthMoreActions } from './cellRenderers/actions.cell';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'electronic-authorizations-table-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class RequestsTableGridComponent extends CoreBaseComponent {
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
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // cellRenderer: (params: ICellRendererParams) => {
        //   return this.timezoneToDatePipe.transform(params.value);
        // },
      },
      {
        headerName: 'worker_name',
        field: 'workerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // filterParams: {
        //   getOptions: () => this.getWorkers(),
        // },
        // cellRenderer: (params: ICellRendererParams) => {
        //   return this.timezoneToDatePipe.transform(params.value);
        // },
      },
      {
        headerName: 'occupation',
        field: 'jobName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // filterParams: {
        //   getOptions: () => this.fetchJobs(),
        // },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'authorized_office',
        field: 'delegationOffice',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),

        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'authorization_status',
        field: 'delegationStatus',
        //   cellRenderer: ElectronicAuthRequestStatusCell,
        filter: this.filterStrategy.matcher(this.filterTypes.select)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.fetchDelegationStatuses(),
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
        cellRenderer: ElectronicAuthMoreActions,
      },
    ];
  }
}
