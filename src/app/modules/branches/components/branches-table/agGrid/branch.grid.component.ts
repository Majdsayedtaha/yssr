import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBranch } from '../../../models';
import { BranchesMoreActionsCell } from './custom-cell/branch-more-action.cell';
@Component({
  selector: 'app-branch-grid',
  template: '',
})
export class BranchGridComponent extends CoreBaseComponent {
  public rowData!: IBranch[];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.branch.name_branch_ar',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.branch.name_branch_en',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.branch.Added_date',
        field: 'creationDate',
        // cellRenderer: DateShowRenderer,
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'table.branch.branch_manager',
        field: 'branchManager',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.branch.mobile',
        field: 'phone1',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.branch.official_email',
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
        cellRenderer: BranchesMoreActionsCell,
      },
    ];
  }
}
