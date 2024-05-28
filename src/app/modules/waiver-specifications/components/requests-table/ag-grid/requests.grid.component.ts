import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { WaiverMoreActionsCell } from './cellRenderers/actions.cell';
@Component({
  selector: 'waiver-specifications-table-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class WaiverSpecificationsRequestGridComponent extends CoreBaseComponent {
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
        headerName: 'religion',
        field: 'religion',
        filter: this.filterStrategy.matcher(this.filterTypes.select)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.fetchReligions(),
        },
      },
      {
        headerName: 'occupation',
        field: 'job',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // filterParams: {
        //   getOptions: () => this.fetchJobs(),
        // },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'age',
        field: 'age',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div>${this.translateService.instant('year') + ' ' + params.value}</div>`;
        },
        filterParams: {
          getOptions: () => this.fetchAges(),
        },
        filter: this.filterStrategy.matcher(this.filterTypes.select)?.getFilterRenderer(),
      },
      {
        headerName: 'country',
        field: 'country',
        filter: this.filterStrategy.matcher(this.filterTypes.select)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.fetchCountries(),
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
