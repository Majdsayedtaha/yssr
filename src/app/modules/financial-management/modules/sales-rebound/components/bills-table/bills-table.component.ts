import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { BillsReboundGridComponent } from './ag-grid/sales-rebound.grid.component';
import { IPaginationOptions } from 'src/app/core/models';
import { IBillsReturnTableSales } from '../../models/bill-rebound.interface';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { SalesReboundService } from '../../services/sales-rebound.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss'],
})
export class BillsTableComponent extends BillsReboundGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;

  constructor(@Inject(INJECTOR) injector: Injector, private _salesReboundService: SalesReboundService) {
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

  onGridReady(params: GridReadyEvent<IBillsReturnTableSales>) {
    this.gridApi = params.api;
    this.getReturnBillTable();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getReturnBillTable();
  }
  getReturnBillTable() {
    this._salesReboundService
      .getReturnSalesList({ ...this.paginationOptions, ...this.filterObj })
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
    return this._salesReboundService.getReturnSalesList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }
}
