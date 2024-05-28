import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { BillsExchangeTableGridComponent } from './ag-grid/bond-table.grid.component';
import { IBillExchange } from '../../models/bill-exchange.interface';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { ExchangeService } from '../../services/exchange.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss'],
})
export class BillsTableComponent extends BillsExchangeTableGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(@Inject(INJECTOR) injector: Injector, private _exchangeService: ExchangeService) {
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

  onGridReady(params: GridReadyEvent<IBillExchange>) {
    this.gridApi = params.api;
    this.getBillTable()
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getBillTable()
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getBillTable() {
    this._exchangeService
      .getExchangeList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      });
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._exchangeService.getExchangeList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }
}
