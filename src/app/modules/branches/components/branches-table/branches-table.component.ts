import { IBranch } from '../../models';
import { GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { BranchService } from '../../services/branch.service';
import { BranchGridComponent } from './agGrid/branch.grid.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-branches-table',
  templateUrl: './branches-table.component.html',
  styleUrls: ['./branches-table.component.scss'],
})
export class BranchesTableComponent extends BranchGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _branchService: BranchService) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent<IBranch>) {
    this.getBranchesList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getBranchesList();
  }

  getBranchesList() {
    this._branchService
      .getBranchesList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
        this.processingCSV(this.rowData);
      });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._branchService.getBranchesList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IBranch[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IBranch) =>
        <IBranch>{
          nameAr: record.nameAr || '',
          creationDate: this.helperService.formatDate(new Date(record.creationDate), false) || '',
          branchManager: record.branchManager || '',
          phone1: record.phone1 || '',
          email1: record.email1 || '',
        }
    );
  }
}
