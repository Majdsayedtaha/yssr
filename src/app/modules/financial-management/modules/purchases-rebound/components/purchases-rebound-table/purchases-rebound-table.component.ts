import { Component, INJECTOR, Injector, OnInit, Inject } from '@angular/core';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { PurchasesReboundGridComponent } from './ag-grid/purchases.grid.component';
import { PurchaseReturnService } from '../../services/Purchase-return.service';
@UntilDestroy()
@Component({
  selector: 'app-purchases-rebound-table',
  templateUrl: './purchases-rebound-table.component.html',
  styleUrls: ['./purchases-rebound-table.component.scss'],
})
export class PurchasesReboundTableComponent extends PurchasesReboundGridComponent implements OnInit {
  gridApi!: GridApi;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _purchaseReturnService: PurchaseReturnService) {
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
    this._purchaseReturnService
      .getPurchaseReturnList({ ...this.paginationOptions, ...this.filterObj })
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
    return this._purchaseReturnService.getPurchaseReturnList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }
}
