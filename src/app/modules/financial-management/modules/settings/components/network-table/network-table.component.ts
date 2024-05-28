import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { NetworkGridComponent } from './ag-grid/network-grid.component';
import { NetworkService } from '../../services/network.service';
import { INetwork } from '../../models/network.interface';
import { DialogNetworkComponent } from './dialog-network/dialog-network.component';
@UntilDestroy()

@Component({
  selector: 'app-network-table',
  templateUrl: './network-table.component.html',
  styleUrls: ['./network-table.component.scss']
})
export class NetworkTableComponent extends NetworkGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _networkService: NetworkService
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

  onGridReady(params: GridReadyEvent<INetwork>) {
    this.gridApi = params.api;
    this.getNetworkList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getNetworkList();
  }

  getNetworkList() {
    this._networkService
      .getNetworkList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }
  addNetwork() {
    const dialogRef = this.matDialog.openDialog(DialogNetworkComponent, {
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
    return this._networkService.getNetworkList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      }),
      catchError(() => of([]))
    );
  }
}

