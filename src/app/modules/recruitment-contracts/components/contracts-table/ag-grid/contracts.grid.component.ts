import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { ContractsMoreActionsCell } from './custom-cells/contract-more-actions.cell';
import { LinkedToResumeContractsCell } from './custom-cells/linked-to-resume-contracts.cell';

@Component({
  selector: 'app-contract-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class ContractsGridComponent extends CoreBaseComponent {
  public columnDefs: ColDef[] = [
    {
      headerName: 'contract_code',
      field: 'code',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'customer_name',
      field: 'customerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      minWidth: 250,
    },
    {
      headerName: 'contract_date',
      field: 'contractDate',
      // cellRenderer: DateShowRenderer,
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'visa_number',
      field: 'visaNo',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'supporting_contract_number',
      field: 'musanedNo',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'country',
      field: 'country',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'occupation',
      field: 'job',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'total_contract_taxed',
      field: 'totalWithTax',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeNumber)?.getFilterRenderer(),
    },
    {
      headerName: 'connectivity_to_resume',
      field: 'connectedWithWorker',
      cellRenderer: LinkedToResumeContractsCell,
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      filterParams: {
        options: [
          { name: 'not-linked', value: false },
          { name: 'linked', value: true },
        ],
      },
      headerComponentParams: {
        stopSort: true,
      },
    },
    {
      headerName: 'worker_name',
      field: 'workerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      minWidth: 250,
    },
    {
      headerName: 'last_action',
      field: 'lastProcedure',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'date_of_last_action',
      field: 'lastProcedureDate',
      // cellRenderer: DateShowRenderer,
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: '',
      field: 'actions',
      pinned: this.getDirection() === 'rtl' ? 'left' : 'right',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: ContractsMoreActionsCell,
    },
  ];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);
  }
}
