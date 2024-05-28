import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-home-grid',
  template: ``,
  styles: [],
})
export class HomeGridComponent extends CoreBaseComponent {
  public rowData!: any[];
  protected override enableFilterAndSortOfTable = false;
  
  public columnDefs: ColDef[] = [
    {
      headerName: 'table.home.taskId',
      field: 'taskId',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.home.taskType',
      field: 'taskType',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.home.description',
      field: 'description',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.home.status',
      field: 'status',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
  ];

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }
}
