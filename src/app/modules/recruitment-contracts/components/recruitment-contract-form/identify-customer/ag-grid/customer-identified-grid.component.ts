import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { CustomersStatusCell } from 'src/app/modules/customers/components/customers-table/ag-grid/custom-cells/customer-status.cell';

@Component({
  selector: 'app-customer-identified-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class CustomerIdentifiedGridComponent extends CoreBaseComponent {
  public override enableFilterAndSortOfTable = false;

  public columnDefs: ColDef[] = [
    {
      headerName: 'customer_code',
      field: 'code',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'customer_name_arabic',
      field: 'nameAr',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      minWidth: 250,
    },
    {
      headerName: 'customer_name_english',
      field: 'nameEn',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      minWidth: 250,
    },
    {
      headerName: 'customer_status',
      field: 'isBlocked',
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      filterParams: {
        options: [
          { name: 'active', value: false },
          { name: 'blocked', value: true },
        ],
      },
      headerComponentParams: {
        stopSort: true,
      },

      cellRenderer: CustomersStatusCell,
    },
    {
      headerName: 'contracts_count',
      field: 'contractsCount',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'financial_status',
      field: 'financialStatus',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
  ];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
      rowSelection: 'single',
      getRowStyle: () => {
        return { cursor: 'pointer' };
      },
    };
  }
}
