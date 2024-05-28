import { IUserAccount } from '../../models';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { UserGridComponent } from './agGrid/user.grid.component';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';

@UntilDestroy()
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent extends UserGridComponent implements OnInit {
  //#region Variables
  private gridApi!: GridApi;
  public listData!: IUserAccount[];
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  //#endregion

  constructor(@Inject(INJECTOR) injector: Injector, private _employeeService: EmployeesService) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          return this.getList(res).pipe(catchError(() => of([])));
        }),
        catchError(() => of([]))
      )
      .subscribe(() => {});
  }

  onGridReady(params: GridReadyEvent<IUserAccount>) {
    this.gridApi = params.api;
    this.getUsersLists();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getUsersLists();
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._employeeService.getUsers({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap((res: any) => {
        this.paginationOptions = res.data.pagination;
        this.listData = res.data.list;
        this.gridApi.setRowData(this.listData);
        this.processingCSV(this.listData);
      })
    );
  }

  getUsersLists() {
    this._employeeService.getUsers({ ...this.paginationOptions, ...this.filterObj }).subscribe((res: any) => {
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

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._employeeService.getUsers({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IUserAccount[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: IUserAccount) =>
        <IUserAccount>{
          userName: record.userName || '',
          creationDate: this.helperService.formatDate(new Date(record.creationDate), true) || '',
          role: record.role || '',
          email1: record.email1 || '',
          phone1: record.phone1 || '',
        }
    );
  }
}
