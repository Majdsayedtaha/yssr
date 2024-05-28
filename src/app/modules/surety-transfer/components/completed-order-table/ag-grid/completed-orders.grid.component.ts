import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { TransferTypeCell } from './cellRenderers/transfer-type.cell';
import { CompletedOrdersMoreActionsCell } from './cellRenderers/actions.cell';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'surety-transfer-orders-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class CompletedOrdersGridComponent extends CoreBaseComponent implements OnInit {
  public rowData!: [];
  public columnDefs: ColDef[] = [];

  constructor(
    @Inject(INJECTOR) injectorCh: Injector,
    protected timezoneToDatePipe: TimezoneToDatePipe,
    private route: ActivatedRoute
  ) {
    super(injectorCh);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(query => {
      this.columnDefs = [
        {
          headerName: 'order_number',
          field: 'requestNumber',
          filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        },
        {
          headerName: 'order_date',
          field: 'date',
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
          headerName: 'sponsorship_transfer_type',
          field: 'transferType',
          // cellRenderer: TransferTypeCell,
          filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
          filterParams: {
            getOptions: () => this.fetchSponsorTransferTypes(),
          },
          headerComponentParams: {
            stopSort: true,
          },
        },
        {
          headerName: 'financial_status',
          field: 'financialStatus',
          // cellRenderer: (params: ICellRendererParams) => {
          //   return '';
          // },
          filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
          filterParams: {
            getOptions: () => this.fetchFinancialStatus(),
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
          cellRenderer: CompletedOrdersMoreActionsCell,
        },
      ];
      if (query) {
        let employment = query['employment'] as boolean;
        if (employment) {
          this.columnDefs = this.columnDefs.filter(col => col.field !== 'workerName');
        }
      }
    });
  }
}
