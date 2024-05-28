import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICellRendererParams, GridReadyEvent, ColDef, GridApi } from 'ag-grid-community';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IEmployee } from 'src/app/modules/employees/interfaces/employee.interfaces';
import { EmployeeActionCell } from './ag-grid/employee-action.cell';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { IRoleEnum } from 'src/app/core/constants';

@UntilDestroy()
@Component({
  template: `
    <div class="d-flex-header">
      <mat-form-field [dir]="getDirection()" class="input-table" style="display: block">
        <input
          matInput
          (input)="getDeepWithFilter($event)"
          placeholder="{{ 'search_for_specific_employee' | translate }}" />
        <mat-icon
          matSuffix
          class="icon"
          [svgIcon]="getDirection() === 'rtl' ? 'search-right' : 'search-left'"></mat-icon>
      </mat-form-field>
    </div>
    <!-- Table -->
    <ag-grid-angular
      authorization
      [roleValue]="role"
      [authName]="authCanView"
      roleCss="block"
      id="myGrid"
      class="ag-theme-alpine grid"
      [columnDefs]="columnDefs"
      [rowData]="employeeList"
      [enableRtl]="true"
      (gridReady)="onGridReady($event)"
      [gridOptions]="gridOptions"></ag-grid-angular>
    <!-- Pagination -->
    <ag-pagination
      authorization
      [roleValue]="role"
      [authName]="authCanView"
      [pageSize]="paginationOptions.pageSize"
      [lengthData]="paginationOptions.totalCount"
      (pageChanged)="onSetPage($event)"></ag-pagination>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
})
export class EmployeesTableComponent extends CoreBaseComponent implements OnInit {
  public columnDefs: ColDef[] = [];
  public isLoading: boolean = false;
  public employeeList!: IEmployee[];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  public gridApi!: GridApi;
  public role = IRoleEnum.Employee;

  constructor(@Inject(INJECTOR) injector: Injector, private _employeesService: EmployeesService) {
    super(injector);
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

    this.initColDef();
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.employee_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.employee_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.first_mobile',
        field: 'phone1',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.second_mobile',
        field: 'phone2',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.first_email',
        field: 'email1',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.second_email',
        field: 'email2',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.employee_type',
        field: 'employeeType.name',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.commission_status',
        field: 'withCommission',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div>${
            params.value === true
              ? this.translateService.instant('setting.fields.has_commission')
              : params.value === false
              ? this.translateService.instant('setting.fields.without_commission')
              : ''
          }</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
        filterParams: {
          options: [
            { name: 'false', value: false },
            { name: 'true', value: true },
          ],
        },
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: EmployeeActionCell,
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getEmployees();
  }

  onGridReady(params: GridReadyEvent<IEmployee>) {
    this.gridApi = params.api;
    this.getEmployees();
  }

  getEmployees() {
    this._employeesService.getEmployees({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.employeeList = res.data.list;
      this.paginationOptions = res.data.pagination;
      // this.processingCSV(this.employeeList);
    });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._employeesService.getEmployees({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.employeeList = res.data.list;
        this.gridOptions?.api?.setRowData(this.employeeList);
        // this.processingCSV(this.employeeList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}
