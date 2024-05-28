import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEndRecruitmentContracts } from '../../../models/home.interface';
import { IPaginationOptions } from 'src/app/core/models';

@Component({
  selector: 'app-grid-ExpirationRecruitment-grid',
  template: '',
})
export class ExpirationRecruitmentGridComponent extends CoreBaseComponent {
  public rowDataExpirationRecruitment: IEndRecruitmentContracts[] = [];
  public paginationOptionsExpirationRecruitment: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  public columnDefsExpirationRecruitment: ColDef[] = [
    {
      headerName: 'table_charts.customer',
      field: 'customer',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table_charts.worker',
      field: 'worker',
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
      headerName: 'table_charts.end_date',
      field: 'endDate',
      filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
    },
  ];

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }
  onGridReadyExpirationRecruitment(params: GridReadyEvent<any>) {}

}
