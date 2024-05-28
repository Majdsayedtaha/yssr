import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { OfficeGridComponent } from './agGrid/office.grid.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ExternalOfficesService } from '../../services/external-office.service';
import { IExternalOffice } from '../../models';
@UntilDestroy()
@Component({
  selector: 'app-external-office-table',
  templateUrl: './external-office-table.component.html',
  styleUrls: ['./external-office-table.component.scss'],
})
export class ExternalOfficeTableComponent extends OfficeGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;

  constructor(@Inject(INJECTOR) injector: Injector, private _externalOfficesService: ExternalOfficesService) {
    super(injector);
  }

  ngOnInit(): void {
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };

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

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getExternalOffices();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getExternalOffices();
  }

  getExternalOffices() {
    this._externalOfficesService
      .getExternalOffices({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.rowData);
        this.processingCSV(this.rowData);
      });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._externalOfficesService.getExternalOffices({ ...this.paginationOptions, ...this.filterObj }).pipe(
      untilDestroyed(this),
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
        this.processingCSV(this.rowData);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._externalOfficesService.getExternalOffices({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IExternalOffice[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IExternalOffice) =>
        <IExternalOffice>{
          code: record.code || '',
          nameEn: record.nameEn || '',
          nameAr: record.nameAr || '',
          country: record.country || '',
          phoneFirst: record.phoneFirst || '',
          emailFirst: record.emailFirst || '',
        }
    );
  }
}
