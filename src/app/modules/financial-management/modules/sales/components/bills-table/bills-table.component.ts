import { Component, INJECTOR, Injector, OnInit, Inject } from '@angular/core';
import { BillsGridComponent } from './ag-grid/bills.grid.component';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { SalesService } from '../../services/sales.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss'],
})
export class BillsTableComponent extends BillsGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;

  constructor(@Inject(INJECTOR) injector: Injector, private _salesService: SalesService) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          return this.getList(res)?.pipe(
            catchError(res => {
              return of([]);
            })
          );
        }),
        catchError(res => {
          return of([]);
        })
      )
      .subscribe((res: any) => {});
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getBillTable();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getBillTable();
  }
  getBillTable() {
    this._salesService
      .getSalesList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._salesService.getSalesList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }
}
