import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { BillsMovementTableGridComponent } from './ag-grid/movement-table.grid.component';
import { IMovementTransaction } from '../../models/movement.interface';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { MovementTransactionService } from '../../services/MovementTransaction.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss'],
})
export class BillsTableComponent extends BillsMovementTableGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;

  constructor(@Inject(INJECTOR) injector: Injector, private _movementTransactionService: MovementTransactionService) {
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

  onGridReady(params: GridReadyEvent<IMovementTransaction>) {
    this.gridApi = params.api;
    this.getMovementList();
  }

  getMovementList() {
    this._movementTransactionService
      .getMovementList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getMovementList();
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._movementTransactionService.getMovementList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
      }),
      catchError(() => of([]))
    );
  }
}
