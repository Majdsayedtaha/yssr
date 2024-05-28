import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { ContractsGridComponent } from './ag-grid/contracts.grid.component';
import { IContract, IContractStatistics } from '../../models';
import { ContractService } from '../../services/contract.service';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class ContractsTableComponent extends ContractsGridComponent implements OnInit, OnDestroy {
  public contractListData!: IContract[];
  public contractStatistics!: IContractStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _contractService: ContractService,
    override timezoneToDatePipe: TimezoneToDatePipe
  ) {
    super(injector, timezoneToDatePipe);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
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
      .subscribe((res: any) => {});
  }

  onGridReady(params: GridReadyEvent<IContract>) {
    this.getContracts();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getContracts();
  }

  getContracts() {
    this._contractService
      .getContractsList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.contractStatistics = res.data.statistics;
        this.contractListData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.processingCSV(this.contractListData);
        this.gridOptions?.api?.setRowData(this.contractListData);
      });
  }

  getList(filter?: any) {
    if (filter) this.filterObj['query'] = filter.target.value;
    return this._contractService.getContractsList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.contractStatistics = res.data.statistics;
        this.contractListData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.processingCSV(this.contractListData);
        this.gridOptions?.api?.setRowData(this.contractListData);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }

  updateStatistics() {
    this._contractService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.contractStatistics = value;
    });
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._contractService.getContractsList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IContract[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      record =>
        <IContract>{
          code: record.code || '',
          customerName: record.customerName || '',
          contractDate: record.contractDate || '',
          visaNo: record.visaNo || '',
          musanedNo: record.musanedNo || '',
          country: record.country || '',
          job: record.job || '',
          totalWithTax: record.totalWithTax || '',
          connectedWithWorker: this.getTranslation(record.connectedWithWorker ? 'linked' : 'not-linked') || '',
          workerName: record.workerName || '',
          lastProcedure: record.lastProcedure || '',
          lastProcedureDate: record.lastProcedureDate || '',
        }
    );
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._contractService.rowUpdater.next(null);
  }
}
