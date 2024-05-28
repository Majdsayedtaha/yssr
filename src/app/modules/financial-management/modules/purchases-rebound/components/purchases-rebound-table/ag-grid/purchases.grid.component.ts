import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { PurchasesReboundMoreActionsCell } from './cell-action/action-more.cell';
@Component({
  selector: 'app-bills-grid',
  template: '',
})
export class PurchasesReboundGridComponent extends CoreBaseComponent {
  public rowData: any[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    {
      this.columnDefs = [
        {
          headerName: 'field.financial_management.billNumber',
          field: 'purchaseNumber',
          filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.date',
          field: 'date',
          filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
        },
        {
          headerName: 'field.financial_management.resource',
          field: 'externalOffice.name',
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
          cellRenderer: PurchasesReboundMoreActionsCell,
        },
      ];
    }
  }
}
