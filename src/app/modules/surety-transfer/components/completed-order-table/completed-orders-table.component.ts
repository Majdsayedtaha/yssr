import { map, tap } from 'rxjs';
import { ISurety } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { SuretyTransferService } from '../../services/surety-transfer.service';
import { CompletedOrdersGridComponent } from './ag-grid/completed-orders.grid.component';
@UntilDestroy()
@Component({
  selector: 'surety-transfer-completed-orders-table',
  templateUrl: './completed-orders-table.component.html',
  styleUrls: ['./completed-orders-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class CompletedOrdersTableComponent extends CompletedOrdersGridComponent implements OnInit {
  public listData!: ISurety[];
  public waiverStatistics!: any;
  private employment: boolean = true;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _suretyTransferService: SuretyTransferService,
    private _route: ActivatedRoute,
    override timezoneToDatePipe: TimezoneToDatePipe
  ) {
    super(injector, timezoneToDatePipe, _route);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._route.queryParams.pipe(untilDestroyed(this)).subscribe(query => {
      if (query) {
        this.employment = query['employment'] as boolean;
      }
      this.getList().subscribe();
    });
    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap((res: any) => this.getList(res.target.value)?.pipe(catchError(() => of([])))),
        catchError(() => of([]))
      )
      .subscribe((res: any) => {});
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onGridReady(params: GridReadyEvent<any>) {
    //  this.getList().subscribe();
  }

  getList(deepValue?: any) {
    this.filterObj['query'] = deepValue;
    if (!this.employment) this.filterObj['worker_name'] = null;
    return this._suretyTransferService.getCompletedOrders({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.waiverStatistics = res.data.statistics;
        this.listData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.listData);
        this.processingCSV(this.listData);
      })
    );
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getList().subscribe();
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._suretyTransferService.getCompletedOrders({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: ISurety[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: ISurety) =>
        <ISurety>{
          requestNumber: record.requestNumber || '',
          date: this.helperService.formatDate(new Date(record.date), false) || '',
          customerName: record.customerName || '',
          workerName: record.workerName || '',
          transferType: record.transferType || '',
          financialStatus: record.financialStatus || '',
        }
    );
  }
}
