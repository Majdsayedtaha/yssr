import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IWorkerRent } from '../../models/rent.interface';
import { WorkerAvailableCell } from 'src/app/modules/worker/components/filters/worker-available-cell.component';
import { RentMoreActionsCellComponent } from '../grid/rent-more-actions-cell/rent-more-actions-cell.component';

@Component({
  selector: 'app-worker-rent-grid',
  template: '',
})
export class WorkerRentGridComponent extends CoreBaseComponent {
  public rowData!: IWorkerRent[];
  public columnDefs: ColDef[] = [
    {
      headerName: 'table.worker.code',
      field: 'code',
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
      headerName: 'table.worker.status',
      field: 'isAvailable',
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      cellRenderer: WorkerAvailableCell,
      filterParams: {
        options: [
          { name: 'available', value: true },
          { name: 'not_available', value: false },
        ],
      },
      headerComponentParams: {
        stopSort: true,
      },
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
    },
  ];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
  }
}
