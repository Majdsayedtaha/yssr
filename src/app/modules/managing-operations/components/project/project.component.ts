import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { IProject, IProjectStatistics } from '../../models/project.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ProjectService } from '../../services/project.service';
import { ProjectGridComponent } from './ag-grid/project.grid';
import { DialogAddProjectComponentComponent } from '../dialog-add-project-component/dialog-add-project-component.component';
@UntilDestroy()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent extends ProjectGridComponent implements OnInit {
  public projectListData: IProject[] = [];
  public projectStatistics!: IProjectStatistics;
  public gridApi!: GridApi;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _ProjectService: ProjectService,
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
  }

  onGridReady(params: GridReadyEvent<IProject>) {
    this.gridApi = params.api;
    this.getProjectsList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getProjectsList();
  }
  dialogAddProject() {
    const dialogRef = this.matDialog.openDialog(DialogAddProjectComponentComponent, {
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

  getProjectsList() {
    this._ProjectService
      .getProjectList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.projectStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.projectListData = res.data.list;
        this.gridOptions?.api?.setRowData(this.projectListData);
        this.rowData = res.data.list;
      });
    this.updateStatistics();
  }

  updateStatistics() {
    this._ProjectService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.projectStatistics = value;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._ProjectService.getProjectList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.projectStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.projectListData = res.data.list;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.projectListData);
      }),
      catchError(() => of([]))
    );
  }
}
