import { ColDef } from 'ag-grid-community';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { WarrantyMoreActionsCell } from './warranty-more-actions.cell';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { WarrantyStateContractsCell } from './warranty-state.cell';

@Component({
  selector: 'app-recruitment-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class RecruitmentGridComponent extends CoreBaseComponent {
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
    },
    {
      headerName: 'worker_name',
      field: 'workerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'contract_date',
      field: 'contractDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'warranty_start',
      field: 'warrantyStartDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'warranty_end',
      field: 'warrantyEndDate',
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
      headerName: 'warranty_state',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      cellRenderer: WarrantyStateContractsCell,
    },
    {
      headerName: '',
      field: 'actions',
      pinned: 'left',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: WarrantyMoreActionsCell,
    },
  ];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);
  }
}
