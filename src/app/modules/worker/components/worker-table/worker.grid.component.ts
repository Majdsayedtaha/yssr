import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IWorker } from '../../models';
import { WorkerStatusCell } from '../filters/worker-status.cell';
import { WorkersMoreActionsCell } from '../filters/workers-more-actions.cell';

@Component({
  selector: 'app-customer-grid',
  template: '',
})
export class CustomerGridComponent extends CoreBaseComponent {
  public rowData!: IWorker[];
  public columnDefs: ColDef[] = [
    {
      headerName: 'table.worker.code',
      field: 'code',
      // cellRenderer: (params: ICellRendererParams) => '#########'
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.name',
      field: 'name',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.visa_nr',
      field: 'passportNo',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.residence_nr',
      field: 'residenceNo',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.offer',
      field: 'externalOfficeName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.nationality',
      field: 'nationality',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.profession',
      field: 'jobName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.type',
      field: 'cvType',
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      filterParams: {
        getOptions: () => this.fetchCVTypes(),
      },
      cellRenderer: WorkerStatusCell,
    },
    {
      headerName: 'table.worker.salary',
      field: 'monthlySalary',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeNumber)?.getFilterRenderer(),
    },
    {
      headerName: '',
      field: 'actions',
      pinned: 'left',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: WorkersMoreActionsCell,
    },
  ];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
  }
}
