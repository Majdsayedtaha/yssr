import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { IAboutToEndWarrantyContracts } from '../../../models/home.interface';
import { IPaginationOptions } from 'src/app/core/models';
import { ExpirationRecruitmentGridComponent } from './grid-ExpirationRecruitment.component';
import { WarrantyMoreActionsCell } from 'src/app/modules/recruitment-contracts/components/warranty-table/ag-grid/warranty-more-actions.cell';

@Component({
  selector: 'app-grid-TrialPeriodRecruitment-grid',
  template: '',
})
export class TrialPeriodRecruitmentGridComponent extends ExpirationRecruitmentGridComponent {
  public rowDataTrialPeriodRecruitment: IAboutToEndWarrantyContracts[] = [];
  public paginationOptionsTrialPeriodRecruitment: IPaginationOptions = {
    pageNumber: 0,
    pageSize: 10,
    totalCount: 0,
  };

  public columnDefsTrialPeriodRecruitment: ColDef[] = [
    {
      headerName: 'table_charts.customer',
      field: 'customerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.worker',
      field: 'workerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.contract_date',
      field: 'contractDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.last_procedure',
      field: 'lastProcedure',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.remainder_warranty_period',
      field: 'remainderWarrantyPeriod',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
  ];
  public columnDefRecruitment:ColDef[]=[
    {
      headerName: 'table_charts.code',
      field: 'code',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.customer',
      field: 'customerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.worker',
      field: 'workerName',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.contract_date',
      field: 'contractDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.visa_nr',
      field: 'visaNo',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.musanedNo',
      field: 'musanedNo',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.country',
      field: 'country',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.job',
      field: 'job',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },

    {
      headerName: '',
      field: 'actions',
      pinned: this.getDirection() === 'rtl' ? 'left' : 'right',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: WarrantyMoreActionsCell
    },
  ]

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }
  onGridReadyTrialPeriodRecruitment(params: GridReadyEvent<any>) {}
}
