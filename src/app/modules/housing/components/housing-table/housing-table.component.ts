import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { HousingGridComponent } from '../grid/housing-grid/housing-grid.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IHousing, IHousingStatistics } from '../../models';
import { IPaginationOptions } from 'src/app/core/models';
import { HousingService } from '../../services/housing.service';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-housing-table',
  templateUrl: './housing-table.component.html',
  styleUrls: ['./housing-table.component.scss'],
})
export class HousingTableComponent extends HousingGridComponent implements OnInit {
  //#region Variables
  private gridApi!: GridApi;
  public listData!: IHousing[];
  public statistics!: IHousingStatistics;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 10 };
  //#endregion

  constructor(private _housingService: HousingService, @Inject(INJECTOR) injector: Injector) {
    super(injector);
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

  onGridReady(params: GridReadyEvent<IHousing>) {
    this.gridApi = params.api;
    this.getRentsLists();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getRentsLists();
  }

  getRentsLists() {
    this._housingService.getHousingsList({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.statistics = res.data.statistics;
      this.paginationOptions = res.data.pagination;
      this.listData = res.data.list;
      this.gridApi.setRowData(this.listData);
      this.processingCSV(this.listData);
    });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getList(deepValue?: any) {
    this.filterObj['query'] = deepValue?.target?.value;
    return this._housingService.getHousingsList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      untilDestroyed(this),
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
    this._housingService
      .getStatistics()
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        if (value) this.statistics = value;
      });
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._housingService.getHousingsList({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IHousing[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IHousing) =>
        <IHousing>{
          name: record.name || '',
          apartmentsCount: record.apartmentsCount || '',
          address: record.address || '',
          capacity: record.capacity || '',
        }
    );
  }
}
