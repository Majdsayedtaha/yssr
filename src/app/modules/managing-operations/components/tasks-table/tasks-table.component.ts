import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ITask, ITaskStatistics } from '../../models/task.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { ManagingOperationsGridComponent } from './ag-grid/task.grid.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { TaskService } from '../../services/task.service';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent extends ManagingOperationsGridComponent implements OnInit {
  public taskListData: ITask[] = [];
  public taskStatistics!: ITaskStatistics;
  public gridApi!: GridApi;
  public updateStatusArr: IEnum[] = [];
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _taskService: TaskService,
    private matDialog: DialogService
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
    this.statusTask();
  }

  statusTask() {
    this.getTasksStatuses()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.updateStatusArr = res.data;
      });
  }

  onGridReady(params: GridReadyEvent<ITask>) {
    this.gridApi = params.api;
    this.getTasksList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getTasksList();
  }
  dialogAddTask() {
    const dialogRef = this.matDialog.openDialog(DialogAddTaskComponent, {
      data: { update: false },
      disableClose: false,
      size: 'l',
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

  getTasksList() {
    this._taskService
      .getTaskList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.taskStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.taskListData = res.data.list;
        this.gridOptions?.api?.setRowData(this.taskListData);
        this.rowData = res.data.list;
      });
    this.updateStatistics();
  }

  updateStatistics() {
    this._taskService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.taskStatistics = value;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._taskService.getTaskList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.taskStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.taskListData = res.data.list;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.taskListData);
      }),
      catchError(() => of([]))
    );
  }
}
