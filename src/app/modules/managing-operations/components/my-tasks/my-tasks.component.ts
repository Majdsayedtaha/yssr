import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ITask, ITaskStatistics } from '../../models/task.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { MyTaskGridComponent } from './ag-grid/my-task.grid.component';
@UntilDestroy()
@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent extends MyTaskGridComponent implements OnInit {
  public myTaskListData: ITask[] = [];
  public myTaskStatistics!: ITaskStatistics;
  public gridApi!: GridApi;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _taskService: TaskService) {
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

  onGridReady(params: GridReadyEvent<ITask>) {
    this.gridApi = params.api;
    this.getTasksList();
  }

  onSetPage(pageNumber: number) {
    this.getTasksList();
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  getTasksList() {
    this._taskService
      .getMyTask({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.myTaskStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.myTaskListData = res.data.list;
        this.gridOptions?.api?.setRowData(this.myTaskListData);
        this.rowData = res.data.list;
      });
    this.updateStatistics();
  }

  updateStatistics() {
    this._taskService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.myTaskStatistics = value;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._taskService.getMyTask({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.myTaskStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.myTaskListData = res.data.list;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.myTaskListData);
      }),
      catchError(() => of([]))
    );
  }
}
