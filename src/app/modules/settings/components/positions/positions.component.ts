import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IRoleEnum } from 'src/app/core/constants';
import { DialogService } from 'src/app/core/services/dialog.service';
import { PositionsService } from '../../services/position.service';
import { PositionActionCellComponent } from './ag-grid/position-action.cell';
import { DialogPositionComponent } from './dialog/dialog-position/dialog-position.component';
import { IPosition } from '../../models/position.interface';
@UntilDestroy()
@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
})
export class PositionsComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public gridApi!: GridApi;
  public listData: IPosition[] = [];
  public role = IRoleEnum.Template;
  public columnDefs: ColDef[] = [];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  // #endregion

  constructor(
    private _matDialog: DialogService,
    @Inject(INJECTOR) injector: Injector,
    private _positionsService: PositionsService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  // #region Life Cycle
  ngOnInit(): void {
    this.initColDef();
    this.watchSearch();
  }
  // #endregion

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.name_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.name_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: PositionActionCellComponent,
      },
    ];
  }

  watchSearch() {
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

  openPositionForm() {
    this._matDialog.openDialog(DialogPositionComponent, { disableClose: true }).subscribe(res => {
      if (res.position && res.type === 'add') {
        const position: IPosition = res.position;
        this.gridApi.applyTransaction({ add: [position] });
      }
    });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getRolesTable();
  }

  onGridReady(params: GridReadyEvent<IPosition>) {
    this.gridApi = params.api;
    this.getRolesTable();
  }

  getRolesTable() {
    this._positionsService.getRolesTable(this.paginationOptions).subscribe((res: any) => {
      this.listData = res.data.list;
      this.paginationOptions = res.data.pagination;
      this.gridOptions?.api?.setRowData(this.listData);
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._positionsService.getRolesTable({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap((res: any) => {
        this.paginationOptions = res.data.pagination;
        this.listData = res.data.list;
        this.gridOptions?.api?.setRowData(this.listData);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}
