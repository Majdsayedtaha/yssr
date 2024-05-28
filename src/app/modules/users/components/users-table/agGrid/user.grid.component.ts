import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IUserTable } from '../../../models';
import { UserMoreActionsCell } from './custom-cell/user-more-action.cell';
@Component({
  selector: 'app-branch-grid',
  template: '',
})
export class UserGridComponent extends CoreBaseComponent {
  public rowData!: IUserTable[];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);

    this.columnDefs = [
      {
        headerName: 'table.user.username',
        field: 'name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },

      {
        headerName: 'table.user.Added_date',
        field: 'creationDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'role_position',
        field: 'role',
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.fetchRoles(),
        },
      },
      {
        headerName: 'table.user.mobile',
        field: 'phone1',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.user.official_email',
        field: 'email1',
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
        cellRenderer: UserMoreActionsCell,
      },
    ];
  }
}
