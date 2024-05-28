import { Component, OnInit, INJECTOR, Inject, Injector } from '@angular/core';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { RecruitmentGridComponent } from './ag-grid/warranty-table.grid.component';
import { GridReadyEvent } from 'ag-grid-community';
import { IContract, IContractWarrantyStatistics } from '../../models';
import { ContractService } from '../../services/contract.service';
import { IPaginationOptions } from 'src/app/core/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { CompanyService } from 'src/app/modules/settings/services/company.service';

@UntilDestroy()
@Component({
  selector: 'app-warranty-table',
  templateUrl: './warranty-table.component.html',
  styleUrls: ['./warranty-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class RecruitmentOrdersComponent extends RecruitmentGridComponent implements OnInit {
  public contractListData!: IContract[];
  public contractWarrantyStatistics!: IContractWarrantyStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _contractService: ContractService,
    private _companyService: CompanyService,
    override timezoneToDatePipe: TimezoneToDatePipe
  ) {
    super(injector, timezoneToDatePipe);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.fetchWarrantyCheck();
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

  fetchWarrantyCheck() {
    this._companyService
      .getWarrantyEndCheck()
      .subscribe((response: any) => this._contractService._optionContractEnding.next(response.data as boolean));
  }

  updateStatistics() {
    this._contractService.updateStatistics.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.contractWarrantyStatistics = value;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
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
      .getContractsWarrantyList({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.contractWarrantyStatistics = res.data.statistics;
        this.contractListData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.processingCSV(this.contractListData);
        this.gridOptions?.api?.setRowData(this.contractListData);
      });
  }

  getList(filter?: any) {
    if (filter) this.filterObj['query'] = filter.target.value;
    return this._contractService.getContractsWarrantyList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.contractWarrantyStatistics = res.data.statistics;
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

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._contractService.getContractsWarrantyList({ ...this.filterObj, ...pagination }).pipe(
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
}
