import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IBank } from '../../../models/bank.interface';
import { BankMoreActionsCell } from '../more-action/bank-action-more.cell';
@Component({
  selector: 'app-Bank-grid',
  template: '',
})
export class BankGridComponent extends CoreBaseComponent {
  public rowData: IBank[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.banks.name_bank_ar',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.banks.name_bank_en',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.banks.account_number',
        field: 'accountNumber',
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
        cellRenderer: BankMoreActionsCell,
      },
    ];
  }
}
