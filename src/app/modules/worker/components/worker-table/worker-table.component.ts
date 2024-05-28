import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IWorker, IWorkerStatistics } from '../../models';
import { WorkerService } from '../../services/worker.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { CustomerGridComponent } from './worker.grid.component';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'worker-table',
  templateUrl: './worker-table.component.html',
  styleUrls: ['./worker-table.component.scss'],
})
export class WorkerTableComponent extends CustomerGridComponent implements OnInit {
  private gridApi!: GridApi;
  public listData!: IWorker[];
  public statistics!: IWorkerStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(private _workerService: WorkerService, @Inject(INJECTOR) injector: Injector) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          return this.getList(res)?.pipe(catchError(() => of([])));
        }),
        catchError(() => of([]))
      )
      .subscribe(() => {});
    this.updateStatistics();
  }

  onGridReady(params: GridReadyEvent<IWorker>) {
    this.gridApi = params.api;
    this.getWorkersLists();
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getWorkersLists();
  }

  getWorkersLists() {
    this._workerService.getWorkersList({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.statistics = res.data.statistics;
      this.paginationOptions = res.data.pagination;
      this.listData = res.data.list;
      this.gridApi.setRowData(this.listData);
      this.processingCSV(this.listData);
    });
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._workerService.getWorkersList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.statistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.listData = res.data.list;
        this.gridApi.setRowData(this.listData);
        this.processingCSV(this.listData);
      })
    );
  }

  updateStatistics() {
    this._workerService
      .getStatistics()
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        if (value) this.statistics = value;
      });
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._workerService.getWorkersList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IWorker[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IWorker) =>
        <IWorker>{
          code: record.code || '',
          name: record.name || '',
          passportNo: record.passportNo || '',
          residenceNo: record.residenceNo || '',
          externalOfficeName: record.externalOfficeName || '',
          nationality: record.nationality || '',
          jobName: record.jobName || '',
          cvType: record.cvType || '',
          monthlySalary: record.monthlySalary || '',
        }
    );
  }
}
