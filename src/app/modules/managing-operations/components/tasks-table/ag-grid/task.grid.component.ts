import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { managingOperationsMoreActionsCell } from './custom-cell/task.cell';
import { ITask } from '../../../models/task.interface';
@Component({
  selector: 'app-managing-operations-grid',
  template: '',
})
export class ManagingOperationsGridComponent extends CoreBaseComponent {
  public rowData: ITask[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.managing_operations.date_start',
        field: 'startDate',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.date_end',
        field: 'endDate',

        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.priority',
        field: 'priority',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.priority?.name || params.data.priorityId?.name} </div>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.imp_task',
        field: 'user',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.user?.name || params.data.userId?.name} </div>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.status_task',
        field: 'status',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.status?.name || params.data.statusId?.name} </div>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.project',
        field: 'project',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.project?.name || params.data.projectId?.name} </div>`;
        },
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
        cellRenderer: managingOperationsMoreActionsCell,
      },
    ];
  }
}
