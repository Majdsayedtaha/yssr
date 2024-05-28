import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { IAgTemplate } from 'src/app/core/components/ag-custom-grid/models/ag-template.interface';
import { IPaginationOptions } from 'src/app/core/models';
import { OrderGridComponent } from './ag-grid/order.grid.component';
import { RefundService } from '../../services/refund.service';
import { IRefund, IRefundStatistics } from '../../models';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class OrdersTableComponent extends OrderGridComponent implements OnInit, IAgTemplate {
  public orderListData!: IRefund[];
  public orderStatistics!: IRefundStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  id!: string;
  gridApi!: GridApi;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    override timezoneToDatePipe: TimezoneToDatePipe,
    private _refundService: RefundService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector, timezoneToDatePipe);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.params['id'];
    this.updateStatistics();

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
      .subscribe();
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getOrdersList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getOrdersList();
  }

  getOrdersList() {
    this._refundService
      .getRefundsList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.paginationOptions = res.data.pagination;
        this.orderListData = res.data.list;
        this.orderStatistics = res.data.statistics;
        this.gridOptions?.api?.setRowData(this.orderListData);
      });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._refundService.getRefundsList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap((res: any) => {
        this.orderStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.orderListData = res.data.list;
        this.gridOptions?.api?.setRowData(this.orderListData);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }

  updateStatistics() {
    this.refundService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.orderStatistics = value;
    });
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._refundService.getRefundsList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IRefund[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: any) =>
        <any>{
          code: record.code || '',
          requestNumber: record.requestNumber || '',
          requestDate: record.requestDate || '',
          customerName: record.customerName || '',
          workerName: record.workerName || '',
          recruitmentContractNo: record.recruitmentContractNo || '',
          recruitmentContractDate: record.recruitmentContractDate || '',
          customerProcedureName: record.customerProcedureName || '',
          arrivalDate: record.arrivalDate || '',
          restPeriodWithCustomer: record.restPeriodWithCustomer || '',
          periodWithCustomer: record.periodWithCustomer || '',
          lastProcedureDate: record.lastProcedureDate || '',
          lastProcedure: record.lastProcedure || '',
        }
    );
  }
}
