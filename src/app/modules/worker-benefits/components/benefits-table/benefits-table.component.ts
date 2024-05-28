import { map, tap } from 'rxjs';
import { IBenefitRow } from '../../models';
import { IEnum } from 'src/app/core/interfaces';
import { GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { BenefitsGridComponent } from './ag-grid/benefits.grid.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { WorkerBenefitsService } from '../../services/worker-benefits.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'worker-benefits-table',
  templateUrl: './benefits-table.component.html',
  styleUrls: ['./benefits-table.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class BenefitsTableComponent extends BenefitsGridComponent implements OnInit {
  public listData!: IBenefitRow[];
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _workerBenefitsService: WorkerBenefitsService,
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
    this._workerBenefitsService.fetchBenefits({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.listData = res.data.list;
      this.paginationOptions = res.data.pagination;
      this.gridOptions?.api?.setRowData(this.listData);
      this.processingCSV(this.listData);
    });
  }

  getList(deepValue?: any) {
    this.filterObj['query'] = deepValue?.target?.value;
    return this._workerBenefitsService.fetchBenefits({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
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
    return this._workerBenefitsService.fetchBenefits({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IBenefitRow[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IBenefitRow) =>
        <IBenefitRow>{
          worker: record.worker || '',
          benefitType: record.benefitType || '',
          amount: record.amount || '',
        }
    );
  }
}
