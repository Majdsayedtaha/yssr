import { Component, INJECTOR, Inject, Injector, OnInit, OnDestroy } from '@angular/core';
import { GridReadyEvent } from 'ag-grid-community';
import { ICustomer, ICustomerStatistics } from '../../models/customer.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomerService } from '../../services/customer.service';
import { CustomerGridComponent } from './ag-grid/customer.grid.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { tap, catchError, of, debounceTime, switchMap, map } from 'rxjs';
import { IAgTemplate } from 'src/app/core/components/ag-custom-grid/models/ag-template.interface';
import { IPaginationOptions } from 'src/app/core/models';

@UntilDestroy()
@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class CustomersTableComponent extends CustomerGridComponent implements OnInit, IAgTemplate {
  public customerListData!: ICustomer[];
  public customerStatistics!: ICustomerStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _customerService: CustomerService,
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

  onGridReady(params: GridReadyEvent<ICustomer>) {
    this.getCustomersList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getCustomersList();
  }

  getCustomersList() {
    this._customerService
      .getCustomersList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.customerStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.customerListData = res.data.list;
        this.gridOptions?.api?.setRowData(this.customerListData);
        this.rowData = res.data.list;
        this.processingCSV(this.rowData);
      });
    this.updateStatistics();
  }

  updateStatistics() {
    this._customerService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.customerStatistics = value;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._customerService.getCustomersList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.customerStatistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.customerListData = res.data.list;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.customerListData);
        this.processingCSV(this.rowData);
      }),
      catchError(() => of([]))
    );
  }

  getAllData() {
    const paginationOptions: IPaginationOptions = {
      pageNumber: 0,
      pageSize: this.paginationOptions.totalCount,
      totalCount: this.paginationOptions.totalCount,
    };
    this._customerService
      .getCustomersList({ ...paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => this.processingCSV(res.data.list));
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._customerService.getCustomersList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: ICustomer[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (customer: ICustomer) =>
        <ICustomer>{
          code: customer.code || '',
          name: customer.name || '',
          creationDate: customer.creationDate || '',
          identificationNumber: customer.identificationNumber || '',
          city: customer.city || '',
          isBlocked: this.translateService.instant(customer.isBlocked ? 'block' : 'active') || '',
          homeWorkersCount: customer.homeWorkersCount || '',
        }
    );
  }
}
