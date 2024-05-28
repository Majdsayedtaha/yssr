import { map, tap } from 'rxjs';
import { IWaiver } from '../../models';
import { GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { WaiverService } from '../../services/waiver.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { WaiverOrdersGridComponent } from './ag-grid/requests.grid.component';

@UntilDestroy()
@Component({
  selector: 'waiver-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class WaiverRequestsTableComponent extends WaiverOrdersGridComponent implements OnInit {
  public waiverListData!: IWaiver[];
  public waiverStatistics!: any;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _waiverService: WaiverService,
    override timezoneToDatePipe: TimezoneToDatePipe
  ) {
    super(injector, timezoneToDatePipe);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.subjectSub = this.subject
      ?.pipe(
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

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.getWaiverRequestsList();
  }

  getWaiverRequestsList() {
    this._waiverService
      .fetchWaiverRequests({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.waiverStatistics = res.data.statistics;
        this.waiverListData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.waiverListData);
        this.processingCSV(this.waiverListData);
      });
  }

  getList(deepValue?: any) {
    this.filterObj['query'] = deepValue?.target?.value;
    return this._waiverService.fetchWaiverRequests({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.waiverStatistics = res.data.statistics;
        this.waiverListData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.waiverListData);
        this.processingCSV(this.waiverListData);
      })
    );
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getWaiverRequestsList();
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._waiverService.fetchWaiverRequests({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IWaiver[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop();
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IWaiver) =>
        <IWaiver>{
          requestNumber: record.requestNumber || '',
          requestDate: record.requestDate || '',
          customerName: record.customerName || '',
          workerName: record.workerName || '',
          nationality: record.nationality || '',
          sponsorshipTransferred: this.getTranslation(
            record.sponsorshipTransferred ? 'request-moved' : 'request-not-moved'
          ),
        }
    );
  }
}
