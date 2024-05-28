import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';

import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { BenefitsMoreActionsCell } from './cellRenderers/actions.cell';
@Component({
  selector: 'worker-benefits-table-grid',
  template: '',
  providers: [TimezoneToDatePipe],
})
export class BenefitsGridComponent extends CoreBaseComponent {
  public rowData!: [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector, protected timezoneToDatePipe: TimezoneToDatePipe) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'worker_name',
        field: 'worker',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        // filterParams: {
        //   getOptions: () => this.getWorkers(),
        // },
      },
      {
        headerName: 'label.benefit.allowances',
        field: 'benefitType',
        filter: this.filterStrategy.matcher(this.filterTypes.select)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.enumService.getBenefitTypes(),
        },
      },
      {
        headerName: 'label.benefit.due_date',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'label.benefit.amount',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeNumber)?.getFilterRenderer(),
        field: 'amount',
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: BenefitsMoreActionsCell,
      },
    ];
  }
}
