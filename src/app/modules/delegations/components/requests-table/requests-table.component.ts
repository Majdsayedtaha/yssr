import { map, tap } from 'rxjs';
import { GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ElectronicAuthService } from '../../services/delegations.service';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { RequestsTableGridComponent } from './ag-grid/requests.grid.component';
import { IDelegation, IDelegationsStatistics } from '../../models';
@UntilDestroy()
@Component({
  selector: 'electronic-authorization-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class WaiverRequestsTableComponent extends RequestsTableGridComponent implements OnInit {
  public listData!: any[];
  public statistics!: IDelegationsStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _electService: ElectronicAuthService,
    override timezoneToDatePipe: TimezoneToDatePipe
  ) {
    super(injector, timezoneToDatePipe);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => this.getList(res)?.pipe(catchError(() => of([])))),
        catchError(() => of([]))
      )
      .subscribe((res: any) => {});
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.getWaiverRequestsList();
  }

  getWaiverRequestsList() {
    this._electService
      .fetchRequests({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.statistics = res.data.statistics;
        this.listData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.listData);
        this.processingCSV(this.listData);
      });
  }

  getList(deepValue?: any) {
    this.filterObj['query'] = deepValue?.target?.value;
    return this._electService.fetchRequests({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.statistics = res.data.statistics;
        this.listData = res.data.list;
        this.gridOptions?.api?.setRowData(this.listData);
        this.processingCSV(this.listData);
      })
    );
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getWaiverRequestsList();
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._electService.fetchRequests({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IDelegation[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IDelegation) =>
        <IDelegation>{
          requestNumber: record.requestNumber || '',
          requestDate: record.requestDate || '',
          customerName: record.customerName || '',
          workerName: record.workerName || '',
          jobName: record.jobName || '',
          delegationOffice: record.delegationOffice || '',
          delegationStatus: record.delegationStatus || '',
        }
    );
  }
}
