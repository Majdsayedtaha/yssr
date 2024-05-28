import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ReceiptTableGridComponent } from './ag-grid/receipt-table.grid.component';
import { IBillReceipt } from '../../models/bill-receipt.interface';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { ReceiptService } from '../../services/receipt.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss'],
})
export class BillsTableComponent extends ReceiptTableGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(@Inject(INJECTOR) injector: Injector, private _receiptService: ReceiptService) {
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

  onGridReady(params: GridReadyEvent<IBillReceipt>) {
    this.gridApi = params.api;
    this.getReceiptList();
  }

  getReceiptList() {
    this._receiptService
      .getReceiptList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._receiptService.getReceiptList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getReceiptList();
  }
}
