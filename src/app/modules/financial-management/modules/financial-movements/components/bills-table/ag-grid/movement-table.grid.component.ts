import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IMovementTransactionTable } from '../../../models/movement.interface';
import { MovementMoreActionsCell } from './custom-cell/bills-action-more.cell';

@Component({
  selector: 'app-bills-movement-grid',
  template: '',
})
export class BillsMovementTableGridComponent extends CoreBaseComponent {
  public rowData: IMovementTransactionTable[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.financial_management.history_movement',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.movement_type',
        field: 'type',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.amount',
        field: 'amount',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: MovementMoreActionsCell,
      },
    ];
  }
}
