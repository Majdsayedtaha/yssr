import { Component, OnInit, Inject, INJECTOR, Injector } from '@angular/core';
import { RentGridComponent } from '../grid/rent-grid/rent-grid.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IRent, IRentStatistics } from '../../models/rent.interface';
import { IPaginationOptions } from 'src/app/core/models';
import { RentService } from '../../services/rent.service';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-rent-table',
  templateUrl: './rent-table.component.html',
  styleUrls: ['./rent-table.component.scss'],
})
export class RentTableComponent extends RentGridComponent implements OnInit {
  //#region Variables
  private gridApi!: GridApi;
  public listData!: IRent[];
  public statistics!: IRentStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  //#endregion

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

  onGridReady(params: GridReadyEvent<IRent>) {
    this.gridApi = params.api;
    this.getRentsLists();
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getRentsLists();
  }

  getRentsLists() {
    this._rentService.getRentsList({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.statistics = res.data.statistics;
      this.paginationOptions = res.data.pagination;
      this.listData = res.data.list;
      this.gridApi.setRowData(this.listData);
      this.processingCSV(this.listData);
    });
  }

  getList(deepSearch?: any) {
    console.log(deepSearch)
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._rentService.getRentsList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.statistics = res.data.statistics;
        this.paginationOptions = res.data.pagination;
        this.listData = res.data.list;
        this.gridApi.setRowData(this.listData);
        this.processingCSV(this.listData);
        this.updateStatistics();
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
    return this._rentService.getRentsList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IRent[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IRent) =>
        <IRent>{
          requestNumber: record.requestNumber || '',
          requestDate: record.requestDate || '',
          customerName: record.customerName || '',
          workerName: record.workerName || '',
          nationality: record.nationality || '',
          job: record.job || '',
          rentDaysPeriod: record.rentDaysPeriod || '',
          requestStatus: record.requestStatus || this.getTranslation('not_found'),
          lastProcedureName: record.lastProcedureName || this.getTranslation('not_found'),
          lastProcedureDate: record.lastProcedureDate
            ? record.lastProcedureDate
            : this.getTranslation('not_found') || '',
          financialStatus: record.financialStatus || '',
        }
    );
  }
}
