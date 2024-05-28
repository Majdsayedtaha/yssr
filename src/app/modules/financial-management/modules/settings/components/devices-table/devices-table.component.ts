import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { DeviceGridComponent } from './ag-grid/device-grid.component';
import { DeviceService } from '../../services/device.service';
import { IDevice } from '../../models/device.interface';
import { DialogDeviceComponent } from './dialog-device/dialog-device.component';
@UntilDestroy()
@Component({
  selector: 'app-devices-table',
  templateUrl: './devices-table.component.html',
  styleUrls: ['./devices-table.component.scss'],
})
export class DevicesTableComponent extends DeviceGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _deviceService: DeviceService
  ) {
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
  }

  onGridReady(params: GridReadyEvent<IDevice>) {
    this.gridApi = params.api;
    this.getDeviceList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getDeviceList();
  }

  getDeviceList() {
    this._deviceService
      .getDeviceList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }
  addDevice() {
    const dialogRef = this.matDialog.openDialog(DialogDeviceComponent, {
      data: { update: false },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          this.gridApi.applyTransaction({ add: [res] });
          this.matDialog.closeAll();
        }
      },
    });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._deviceService.getDeviceList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      }),
      catchError(() => of([]))
    );
  }
}
