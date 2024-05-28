import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IRent } from '../../../models/rent.interface';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { RentMoreActionsCellComponent } from '../rent-more-actions-cell/rent-more-actions-cell.component';
import { ContractAvailableCell } from '../contract-available-cell.component';

@Component({
  selector: 'app-rent-grid',
  templateUrl: './rent-grid.component.html',
  styleUrls: ['./rent-grid.component.scss'],
})
export class RentGridComponent extends CoreBaseComponent {
  public rowData!: IRent[];

  public columnDefs: ColDef[] = [
    {
      headerName: 'contract_code',
      field: 'requestNumber',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'label.contract.contract_start',
      field: 'fromDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'customer_name',
      field: 'customerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.name',
      field: 'workerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.nationality',
      field: 'nationality',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.worker.profession',
      field: 'job',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.contract.period',
      field: 'rentDaysPeriod',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'table.contract.status',
      field: 'status',
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      cellRenderer: ContractAvailableCell,
      filterParams: {
        options: [
          { name: 'expired', value: true },
          { name: 'not_expired', value: false },
        ],
      },
      headerComponentParams: {
        stopSort: true,
      },
    },
    {
      headerName: 'table.rent.procedure.last',
      field: 'lastProcedureName',
      cellRenderer: (params: ICellRendererParams) =>
        `<div>${params.value ? params.value : this.translateService.instant('not_found')}</div>`,
      filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      filterParams: {
        getOptions: () => this.fetchCustomerProcedures(),
      },
    },
    {
      headerName: 'table.rent.procedure.last_date',
      field: 'lastProcedureDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    // {
    //   headerName: 'table.rent.financial_status',
    //   field: 'financialStatus',
    //   filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
    //   filterParams: {
    //     getOptions: () => this.fetchFinancialStatus(),
    //   },
    // },
    {
      headerName: '',
      field: 'actions',
      pinned: 'left',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: RentMoreActionsCellComponent,
    },
  ];

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }
}
