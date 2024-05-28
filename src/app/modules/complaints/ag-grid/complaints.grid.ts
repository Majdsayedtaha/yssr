import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IComplaint } from '../models/complaints.interface';
import { ComplaintsMoreActionsCell } from '../more-action/complaints-more-action.cell';
@Component({
  selector: 'app-complaints-grid',
  template: '',
})
export class ComplaintsGridComponent extends CoreBaseComponent {
  public rowData: IComplaint[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'field.complaints.customer_name',
        field: 'customer',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.customer?.name} </div>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.complaints.problem_status',
        field: 'status',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div> ${params.data.status?.name} </div>`;
        },
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        filterParams: {
          getOptions: () => this.fetchComplaintsStatus(),
        },
      },
      {
        headerName: 'field.complaints.problem_solve_day_count',
        field: 'solutionDays',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.complaints.final_solve',
        field: 'finalSolution',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.complaints.description',
        field: 'description',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.complaints.suggested_solution',
        field: 'suggestedSolution',
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
        cellRenderer: ComplaintsMoreActionsCell,
      },
    ];
  }
}
