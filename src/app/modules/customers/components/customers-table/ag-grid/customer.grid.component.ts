import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CustomersMoreActionsCell } from './custom-cells/customers-more-actions.cell';
import { ICustomer } from '../../../models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CustomersStatusCell } from './custom-cells/customer-status.cell';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
@Component({
  selector: 'app-customer-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class CustomerGridComponent extends CoreBaseComponent {
  public rowData!: ICustomer[];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'customer_code',
        field: 'code',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'customer_name',
        field: 'name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        minWidth: 250,
      },
      {
        headerName: 'creation_date',
        field: 'creationDate',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'customer_phone',
        field: 'phone1',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // headerComponentParams: {
        //   stopSort: true,
        // },
      },
      {
        headerName: 'identification_number',
        field: 'identificationNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'city',
        field: 'city',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'customer_status',
        field: 'isBlocked',
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        cellRenderer: CustomersStatusCell,
        filterParams: {
          options: [
            { name: 'active', value: false },
            { name: 'blocked', value: true },
          ],
        },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'email',
        field: 'email',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        minWidth: 250,
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: CustomersMoreActionsCell,
      },
    ];
  }
}
