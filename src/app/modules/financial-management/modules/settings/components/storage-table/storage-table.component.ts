import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { StorageGridComponent } from './ag-grid/storage-grid.component';
import { IPaginationOptions } from 'src/app/core/models';
import { IStorage } from '../../models/storage.interface';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DialogActionStorageComponent } from './dialog-action/dialog-action-storage/dialog-action-storage.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { StoreService } from '../../services/store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-storage-table',
  templateUrl: './storage-table.component.html',
  styleUrls: ['./storage-table.component.scss'],
})
export class StorageTableComponent extends StorageGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _storeService: StoreService
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

  onGridReady(params: GridReadyEvent<IStorage>) {
    this.gridApi = params.api;
    this.getStorageList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getStorageList();
  }

  getStorageList() {
    this._storeService
      .getStoreList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }
  addStore() {
    const dialogRef = this.matDialog.openDialog(DialogActionStorageComponent, {
      size: 'l',
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
    return this._storeService.getStoreList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      }),
      catchError(() => of([]))
    );
  }
}
