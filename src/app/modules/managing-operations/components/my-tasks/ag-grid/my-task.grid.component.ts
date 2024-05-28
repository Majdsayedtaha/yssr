import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ITask } from '../../../models/task.interface';

@Component({
  selector: 'app-my-task-grid',
  template: '',
})
export class MyTaskGridComponent extends CoreBaseComponent {
  public rowData: ITask[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.managing_operations.date_start',
        field: 'dateStart',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.date_end',
        field: 'dateEnd',

        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.priority',
        field: 'priority',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.create_task',
        field: 'TaskBuilder',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      // {
      //   headerName: 'field.managing_operations.imp_task',
      //   field: 'TaskExecutor',
      //   filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      // },
      {
        headerName: 'field.managing_operations.status_task',
        field: 'statusTask',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
    ];
  }
}
