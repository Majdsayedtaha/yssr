import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IProject } from '../../../models/project.interface';
import { ProjectCell } from '../cell/project.cell';
@Component({
  selector: 'app-project-grid',
  template: '',
})
export class ProjectGridComponent extends CoreBaseComponent {
  public rowData: IProject[] = [];
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
        headerName: 'field.managing_operations.nameEn',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.managing_operations.nameAr',
        field: 'nameAr',
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
        cellRenderer: ProjectCell,
      },
    ];
  }
}
