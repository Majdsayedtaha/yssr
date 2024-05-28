import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { OrdersMoreActionsCell } from './custom-cells/order-action-more.cell';
@Component({
  selector: 'app-order-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class OrderGridComponent extends CoreBaseComponent {
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);

    this.columnDefs = [
      {
        headerName: 'refund.table.order_number',
        field: 'requestNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.order_date',
        field: 'requestDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.customer_name',
        field: 'customerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.employment_name',
        field: 'workerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.contract_number',
        field: 'recruitmentContractNo',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.contract_date',
        field: 'recruitmentContractDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.customer_procedure',
        field: 'customerProcedureName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.date_employment_arrival_state',
        field: 'arrivalDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.duration_stay_with_customer',
        field: 'restPeriodWithCustomer',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.remaining_time',
        field: 'periodWithCustomer',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.date_last_procedure',
        field: 'lastProcedureDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'refund.table.last_procedure',
        field: 'lastProcedureName',
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
        cellRenderer: OrdersMoreActionsCell,
      },
    ];
  }
}
