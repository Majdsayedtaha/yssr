import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { IBranch } from '../../models';
import { BranchService } from '../../services/branch.service';
import { BranchManagerGridComponent } from './agGrid/manager-branch.grid';
@UntilDestroy()
@Component({
  selector: 'app-managers-table',
  templateUrl: './managers-table.component.html',
  styleUrls: ['./managers-table.component.scss'],
})
export class ManagersTableComponent extends BranchManagerGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _branchService: BranchService) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void { }

  onGridReady(params: GridReadyEvent<IBranch>) {
    this.getBranchesList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getBranchesList();
  }

  getBranchesList() {
    this._branchService
      .getBranchesManagerList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
}
