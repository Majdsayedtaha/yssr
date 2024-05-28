import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { IExpense } from '../../models/expense.interface';
import { ExpenseGridComponent } from './ag-grid/expense-type.grid.component';
import { ExpenseService } from '../../services/expense.service';
import { DialogExpenseComponent } from './dialog-expense/dialog-expense.component';
@UntilDestroy()
@Component({
  selector: 'app-expense-type-table',
  templateUrl: './expense-type-table.component.html',
  styleUrls: ['./expense-type-table.component.scss'],
})
export class ExpenseTypeTableComponent extends ExpenseGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _expenseService: ExpenseService
  ) {
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

  onGridReady(params: GridReadyEvent<IExpense>) {
    this.gridApi = params.api;
    this.getExpenseList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getExpenseList();
  }

  getExpenseList() {
    this._expenseService
      .getExpenseList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }
  addExpense() {
    const dialogRef = this.matDialog.openDialog(DialogExpenseComponent, {
      data: { update: false },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          this.gridApi.applyTransaction({ add: [res] });
          this.matDialog.closeAll();
        }
      },
    });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._expenseService.getExpenseList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      }),
      catchError(() => of([]))
    );
  }
}
