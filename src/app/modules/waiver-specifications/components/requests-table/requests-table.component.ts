import { map, tap } from 'rxjs';
import { GridReadyEvent } from 'ag-grid-community';
import { IWaiverSpecification } from '../../models';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { WaiverSpecificationService } from '../../services/waiver-specifications.service';
import { WaiverSpecificationsRequestGridComponent } from './ag-grid/requests.grid.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'waiver-specifications-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class WaiverRequestsTableComponent extends WaiverSpecificationsRequestGridComponent implements OnInit {
  public waiverListData!: IWaiverSpecification[];
  public waiverStatistics!: any;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _waiverSpecificationService: WaiverSpecificationService,
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
    this._waiverSpecificationService
      .fetchWaiverSpecificationsRequests({ ...this.paginationOptions, ...this.filterObj })
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
    return this._waiverSpecificationService
      .fetchWaiverSpecificationsRequests({ ...this.paginationOptions, ...this.filterObj })
      .pipe(
        tap(res => {
          this.waiverStatistics = res.data.statistics;
          this.waiverListData = res.data.list;
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
    return this._waiverSpecificationService
      .fetchWaiverSpecificationsRequests({ ...this.filterObj, ...pagination })
      .pipe(
        untilDestroyed(this),
        tap(res => (this.csvData = this.processingCSV(res.data.list))),
        map(() => this.csvData) // Return the processed data
      );
  }

  processingCSV(tableData: IWaiverSpecification[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IWaiverSpecification) =>
        <IWaiverSpecification>{
          requestNumber: record.requestNumber || '',
          requestDate: this.helperService.formatDate(new Date(record.requestDate), false) || '',
          religion: record.religion || '',
          job: record.job || '',
          age: record.age || '',
          country: record.country || '',
        }
    );
  }
}
