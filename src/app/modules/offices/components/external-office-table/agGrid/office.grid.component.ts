import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { OfficesMoreActionsCell } from './custom-cell/office-more-action.cell';
import { IExternalOffice } from '../../../models';
@Component({
  selector: 'app-office-grid',
  template: '',
})
export class OfficeGridComponent extends CoreBaseComponent {
  public rowData!: IExternalOffice[];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.office.office_code',
        field: 'code',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.office.office_name_En',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.office.office_name_Ar',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'country',
        field: 'country',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'phone',
        field: 'phoneFirst',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'email',
        field: 'emailFirst',
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
        cellRenderer: OfficesMoreActionsCell,
      },
    ];
  }
}
