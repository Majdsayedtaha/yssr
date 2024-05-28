import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IPurchasesTable } from '../../../models/purchases.interface';
import { PurchasesMoreActionsCell } from './custom-cell/bills-action-more.cell';

@Component({
  selector: 'app-purchase-table-grid',
  template: '',
})
export class PurchaseTableGridComponent extends CoreBaseComponent {
  public rowData: IPurchasesTable[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.financial_management.date',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.supplier_name',
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
        cellRenderer: PurchasesMoreActionsCell,
      },
    ];
  }
}
