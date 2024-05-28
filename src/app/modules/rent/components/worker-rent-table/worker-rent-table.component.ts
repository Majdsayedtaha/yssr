import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { WorkerRentGridComponent } from './worker-rent.grid.component';
import { IRent, IWorkerRent, IWorkerRentStatistics } from '../../models/rent.interface';
import { RentService } from '../../services/rent.service';

@UntilDestroy()
@Component({
  selector: 'app-worker-rent-table',
  templateUrl: './worker-rent-table.component.html',
  styleUrls: ['./worker-rent-table.component.scss'],
})
export class WorkerRentTableComponent extends WorkerRentGridComponent implements OnInit {
  private gridApi!: GridApi;
  public statistics!: IWorkerRentStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(private _rentService: RentService, @Inject(INJECTOR) injector: Injector) {
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

  onGridReady(params: GridReadyEvent<IWorkerRent>) {
    this.gridApi = params.api;
    this.getWorkersRentLists();
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getWorkersRentLists();
  }

  getWorkersRentLists() {
    this._rentService.getWorkersRentList({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.statistics = res.data.statistics;
      this.paginationOptions = res.data.pagination;
      this.rowData = res.data.list;
      this.gridApi.setRowData(this.rowData);
    });
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._rentService.getWorkersRentList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.statistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridApi.setRowData(this.rowData);
      })
    );
  }

  updateStatistics() {
    this._rentService
      .getStatistics()
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        if (value) this.statistics = value;
      });
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._rentService.getWorkersRentList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list as IWorkerRent[]))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IWorkerRent[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IWorkerRent) =>
        <IWorkerRent>{
          code: record.code || '',
          name: record.name || '',
          passportNo: record.passportNo || '',
          residenceNo: record.residenceNo || '',
          isAvailable:
            record.isAvailable === true
              ? this.translateService.instant('available')
              : record.isAvailable === false
              ? this.translateService.instant('not_available')
              : '',
          externalOfficeName: record.externalOfficeName || '',
          nationality: record.nationality || '',
          jobName: record.jobName || '',
          monthlySalary: typeof record.monthlySalary === 'number' ? record.monthlySalary : '',
        }
    );
  }
}
